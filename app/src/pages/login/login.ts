import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SignupPage } from '../signup/signup';
import { FriendsPage } from '../friends/friends';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginForm: FormGroup;
  loginError: string;
  constructor(public navCtrl: NavController, private auth: AuthService, fb: FormBuilder) {
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  login() {
    let data = this.loginForm.value;
    if(!data.email){
      return;
    }
    let credentials = {
      email: data.email,
      password: data.password
    };
    this.auth.signInWithEmail(credentials)
      .then(
        () => this.navCtrl.setRoot(FriendsPage),
        error => this.loginError = error.message
      );
  }

  signup(){
    this.navCtrl.push(SignupPage);
  }
}

