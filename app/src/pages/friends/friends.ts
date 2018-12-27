import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { PhoneUserData } from '../../models/phoneuserdata.interface';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  items: Observable<PhoneUserData[]>;
  constructor(public navCtrl: NavController, private auth: AuthService, private firestore: AngularFirestore) {
    //this.items.push({'name': 'OK', 'uid': '#000000'});
    console.log(this.auth.getUID());
  }
  ngOnInit(){
    this.items = this.firestore.collection<PhoneUserData>('phone_users').valueChanges();
  }
  clicked(item: any){
    this.navCtrl.push(ChatPage, {item: item});
    console.log(item.name);
  }

}
