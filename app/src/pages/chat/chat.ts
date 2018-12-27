import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  title: string;
  item: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = this.navParams.get('item');
    this.title = this.item.name;
  }

}
