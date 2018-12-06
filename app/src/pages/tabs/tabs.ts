import { Component } from '@angular/core';

import { FriendsPage } from '../friends/friends';
import { AccountPage } from '../account/account';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FriendsPage;
  tab2Root = AccountPage;

  constructor() {

  }
}
