import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { PhoneUserData } from '../../models/phoneuserdata.interface';
import { BCIUserData } from '../../models/bciuserdata.interface';
import { AddFriendPage } from '../addfriend/addfriend';
import { map } from 'rxjs/operators';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  items: BCIUserData[];
  constructor(public navCtrl: NavController, private auth: AuthService, private firestore: AngularFirestore, public modalCtrl: ModalController) {
    //this.items.push({'name': 'OK', 'uid': '#000000'});
    this.items = [];
    this.firestore.collection<PhoneUserData>('phone_users').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        if(a.payload.doc.data().UID == this.auth.getUID()){
          a.payload.doc.data().conn.forEach(element => {
            this.firestore.collection<BCIUserData>('bci_users', ref => ref.where('id','==',element)).valueChanges().subscribe(e => {
              var chk = false;
              this.items.forEach(function(value: any, index: number, array: any[]){
                if(value.id == e[0].id){
                  array[index] = e[0];
                  chk = true;
                }
              });
              if(!chk){
                this.items.push(e[0]);
              }
            });
          });
        }
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    )
  }
  clicked(item: any){
    this.navCtrl.push(ChatPage, {item: item});
    console.log(item.name);
  }
  addfriend(){
    let addfriendmodal = this.modalCtrl.create(AddFriendPage);
    addfriendmodal.present();
  }
}
