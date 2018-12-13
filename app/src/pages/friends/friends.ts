import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  items: Array<any>;
  constructor(public navCtrl: NavController) {
    this.items = new Array();
    this.items.push({'name': 'OK'});
  }

  clicked(item: any){
    console.log(item.name);
  }

}
