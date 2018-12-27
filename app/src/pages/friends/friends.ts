import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  items: Array<any>;
  constructor(public navCtrl: NavController, private auth: AuthService) {
    this.items = new Array();
    this.items.push({'name': 'OK', 'uid': '#000000'});
    console.log(auth.getUID());
  }

  clicked(item: any){
    this.navCtrl.push(ChatPage, {item: item});
    console.log(item.name);
  }

}
