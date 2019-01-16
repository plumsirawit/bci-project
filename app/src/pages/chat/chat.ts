import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ChatData } from '../../models/chatdata.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { BCIUserData } from '../../models/bciuserdata.interface';
import firebase from 'firebase';
import { PhoneUserData } from '../../models/phoneuserdata.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  title: string;
  item: BCIUserData;
  chats: ChatData[];
  bci_id: string;
  data: any;
  sub: any;
  senderClass: string;
  id: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private firestore: AngularFirestore, public alertCtrl: AlertController, private auth: AuthService) {
    this.chats = [];
    this.sub = null;
    this.senderClass = '';
    this.bci_id = '';
    var tst = firebase.firestore.FieldValue.serverTimestamp();
    this.data = {data: '', sender: 'phone', timestamp: tst, type: 'message', read: false};
    this.item = this.navParams.get('item');
    this.title = this.item.name.toString();
    this.firestore.collection<BCIUserData>('bci_users',ref => ref.where('id','==',this.item.id)).snapshotChanges().map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return {bid: id, ...data};
    })).subscribe(x => {
      this.bci_id = x[0].bid;
      this.firestore.collection('bci_users').doc<BCIUserData>(this.bci_id).valueChanges().subscribe(val => {this.id = val.id.toString();});
      if(this.sub != null){
        this.sub.unsubscribe();
      }
      this.sub = this.firestore.collection('bci_users').doc(this.bci_id).collection<ChatData>('chats', ref => ref.orderBy('timestamp')).snapshotChanges().map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      })).subscribe(upd => {
        this.chats = [];
        upd.map(x => {
          if(x.timestamp == null || x.timestamp == undefined){
            ;
          }else{
            this.chats.push(x);
          }
        })
      });
    });

  }
  sendMessage() {
    if(this.data.data != ''){
      console.log(this.bci_id);
      this.data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
      this.firestore.collection('bci_users').doc(this.bci_id).collection<ChatData>('chats').add(this.data);
      this.data.data = '';
    }
  }
  textChange() {
    if(this.data.data == ''){
      this.senderClass = 'disabled-icon';
    }else{
      this.senderClass = '';
    }
  }
  confDeleteChat() {
    this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete this chat? Upon deletion, all chat history will be destroyed. This process cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => this.deleteChat()
        }
      ]
    }).present();
  }
  deleteChat() {
    if(this.bci_id != ''){
      this.sub.unsubscribe();
      var ready = true;
      this.firestore.collection('bci_users').doc(this.bci_id).collection<ChatData>('chats').snapshotChanges().map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      })).subscribe(x => {
        if(ready){
          ready = false;
          x.forEach(y => {
            this.firestore.collection('bci_users').doc(this.bci_id).collection('chats').doc(y.id).delete().catch(error => console.log(error));
          });
          this.firestore.collection('bci_users').doc<BCIUserData>(this.bci_id).update({
            conn: ''
          });
          this.firestore.collection<PhoneUserData>('phone_users', ref => ref.where('UID','==',this.auth.getUID())).snapshotChanges().map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          })).subscribe(x => {
            x.forEach(y => {
              var cur = y.conn;
              if(cur.indexOf(this.id) != -1){
                cur.splice(cur.indexOf(this.id),1);
                this.firestore.collection('phone_users').doc(y.id).update({
                  'conn': cur
                });
              }
            })
          })
          this.navCtrl.pop();
        }
      })
    }
  }
}
