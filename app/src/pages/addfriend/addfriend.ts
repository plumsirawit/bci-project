import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { BCIUserData } from '../../models/bciuserdata.interface';
import { AuthService } from '../../services/auth.service';
import { PhoneUserData } from '../../models/phoneuserdata.interface';
import { ChatData } from '../../models/chatdata.interface';

@Component({
  selector: 'page-addfriend',
  templateUrl: 'addfriend.html'
})
export class AddFriendPage {
  did: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private firestore: AngularFirestore, public alertCtrl: AlertController, private auth: AuthService) {
    this.did = "";
  }
  connect(){
    var inprocess = false;
    var curdid = this.did;
    this.firestore.collection<BCIUserData>('bci_users', ref => ref.where('id','==',this.did)).snapshotChanges().map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return {bid: id, ...data};
    })).subscribe(e => {
      if(inprocess){
        ;
      }else if(e.length == 0){
        this.alertCtrl.create({
          title: 'Invalid Data!',
          subTitle: 'The given ID cannot be found. Please recheck your ID.',
          buttons: ['OK']
        }).present();
      }else if(e.length == 1){
        this.firestore.collection<PhoneUserData>('phone_users',ref => ref.where('UID','==',this.auth.getUID())).snapshotChanges().map(actions => 
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          })
        ).subscribe(b => {
          if(curdid != ""){
            b.forEach(dat => {
              var tconn = dat.conn;
              var dup = false;
              tconn.forEach(function(value: string, index: number, array: string[]){
                if(value == curdid){
                  dup = true;
                }
              });
              if(!dup){
                tconn.push(curdid);
                curdid = "";
                var insubprocess = false;
                var ready = true;
                this.firestore.collection<ChatData>('bci_users/'+e[0].bid+'/chats').snapshotChanges().map(actions => actions.map(a => {
                  const data = a.payload.doc.data();
                  const id = a.payload.doc.id;
                  return {id, ...data};
                })).subscribe(vch => {
                  if(ready){
                    vch.forEach(docu => {
                      ready = false;
                      this.firestore.doc<ChatData>('bci_users/'+e[0].bid+'/chats/'+docu.id).delete().catch(error => console.log(error));
                      ready = true;
                    });
                  }
                })
                this.firestore.collection<PhoneUserData>('phone_users',ref => ref.where('UID','==',e[0].conn)).snapshotChanges().map(actions => actions.map(y => {
                  const data = y.payload.doc.data();
                  const id = y.payload.doc.id;
                  return {id, ...data};
                })).subscribe(z => {
                  if(!insubprocess && z.length > 0){
                    var oldconn = z[0].conn;
                    oldconn.splice(oldconn.indexOf(e[0].id),1);
                    insubprocess = true;
                    this.firestore.doc<PhoneUserData>('phone_users/' + z[0].id).update({
                      conn: oldconn
                    });
                  }
                })
                inprocess = true;
                this.firestore.doc<BCIUserData>('bci_users/' + e[0].bid).update({
                  conn: this.auth.getUID()
                });
                inprocess = false;
                this.firestore.doc<PhoneUserData>('phone_users/' + dat.id).update({
                  conn: tconn,
                });
              }else{
                this.alertCtrl.create({
                  title: 'Invalid Data!',
                  subTitle: 'Device already added.',
                  buttons: ['OK'],
                }).present();
              }
            });
            curdid = "";
          }
        });  
      }else{
        this.alertCtrl.create({
          title: 'Invalid Data!',
          subTitle: 'Duplicated Devices Found. Please report this to the application developers.',
          buttons: ['OK']
        }).present();
      }
    });
    this.navCtrl.pop();
  }
  exitModal(){
    this.navCtrl.pop();
  }
}
