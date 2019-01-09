import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { PhoneUserData } from '../../models/phoneuserdata.interface';
import { BCIUserData } from '../../models/bciuserdata.interface';
import { AddFriendPage } from '../addfriend/addfriend';
import { Observable, merge } from 'rxjs';
import { flatMap, map, toArray } from 'rxjs/operators';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  items: any;
  constructor(public navCtrl: NavController, private auth: AuthService, private firestore: AngularFirestore, public modalCtrl: ModalController) {
    //this.items.push({'name': 'OK', 'uid': '#000000'});
    this.items = this.firestore.collection<PhoneUserData>('phone_users',ref => ref.where('UID','==',this.auth.getUID())).valueChanges().map(
      actions => actions[0].conn.map(b => {
        return this.firestore.collection<BCIUserData>('bci_users',ref => ref.where('id','==',b)).valueChanges().map(b => b[0]);
      })
    )
    // this.firestore.collection<PhoneUserData>('phone_users').snapshotChanges().map(actions => actions.map(a => {
    //     const data = a.payload.doc.data();
    //     const id = a.payload.doc.id;
    //     return {id, ...data};
    //   })
    // ).subscribe(b => {
    //   b.forEach(a => {
    //     if(a.UID == this.auth.getUID()){
    //       a.conn.forEach(element => {
    //         this.firestore.collection<BCIUserData>('bci_users', ref => ref.where('id','==',element)).valueChanges().subscribe(e => {
    //           if(e.length == 1){
    //             var chk = false;
    //             this.items.forEach(function(value: any, index: number, array: any[]){
    //               if(value.id == e[0].id){
    //                 array[index] = e[0];
    //                 chk = true;
    //               }
    //             });
    //             if(!chk){
    //               this.items.push(e[0]);
    //             }
    //           }
    //         });
    //       });
    //       var newitems = [];
    //       this.items.forEach(v => {
    //         var chk = false;
    //         a.conn.forEach(element => {
    //           if(element == v.id){
    //             chk = true;
    //           }  
    //         })
    //         if(chk){
    //           newitems.push(v);
    //         }
    //       });
    //       this.items = newitems;
    //     }
    //   })
    // });
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
