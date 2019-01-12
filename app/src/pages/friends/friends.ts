import { Component } from '@angular/core';
import { NavController, ModalController, ItemSliding } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { PhoneUserData } from '../../models/phoneuserdata.interface';
import { BCIUserData } from '../../models/bciuserdata.interface';
import { AddFriendPage } from '../addfriend/addfriend';
import { flatMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  items: BCIUserData[];
  constructor(public navCtrl: NavController, private auth: AuthService, private firestore: AngularFirestore, public modalCtrl: ModalController) {
    this.items = [];
    this.firestore.collection<PhoneUserData>('phone_users').snapshotChanges().map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      })
    ).subscribe(b => {
      b.forEach(a => {
        if(a.UID == this.auth.getUID()){
          a.conn.forEach(element => {
            this.firestore.collection<BCIUserData>('bci_users', ref => ref.where('id','==',element)).valueChanges().subscribe(e => {
              if(e.length == 1){
                var chk = false;
                this.items.forEach(function(value: any, index: number, array: any[]){
                  if(value.id == e[0].id){
                    array[index] = e[0];
                    chk = true;
                  }
                });
                if(!chk){
                  this.items.push(e[0]);
                  this.items.sort(function(a,b) {
                    return a.name.localeCompare(b.name.toString());
                  })
                }
              }
            });
          });
          var newitems = [];
          this.items.forEach(v => {
            var chk = false;
            a.conn.forEach(element => {
              if(element == v.id){
                chk = true;
              }  
            })
            if(chk){
              newitems.push(v);
            }
          });
          this.items = newitems;
          this.items.sort(function(a,b) {
            return a.name.localeCompare(b.name.toString());
          })
        }
      })
    });
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
