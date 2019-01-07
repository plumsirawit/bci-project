import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { PhoneUserData } from '../../models/phoneuserdata.interface';
import { BCIUserData } from '../../models/bciuserdata.interface';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  items: BCIUserData[];
  constructor(public navCtrl: NavController, private auth: AuthService, private firestore: AngularFirestore) {
    //this.items.push({'name': 'OK', 'uid': '#000000'});
    this.items = [];
    console.log(this.auth.getUID());
    this.firestore.collection<PhoneUserData>('phone_users').valueChanges().subscribe(e => {
      var cur = e[0].conn;
      this.items = [];
      cur.forEach(element => {
        this.firestore.collection<BCIUserData>('bci_users', ref => ref.where('id','==',element)).valueChanges().subscribe(e => {
          this.items.push(e[0]);
        });
      });
    });
  }
  clicked(item: any){
    this.navCtrl.push(ChatPage, {item: item});
    console.log(item.name);
  }

}
