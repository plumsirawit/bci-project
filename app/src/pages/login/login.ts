import { Component } from '@angular/core';
import { NavController, AlertController, Alert } from 'ionic-angular';
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
  currentAlert: Alert;
  constructor(public navCtrl: NavController, private auth: AuthService, fb: FormBuilder, public alertCtrl: AlertController) {
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
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
        usrc => {
          if(usrc.user && !usrc.user.emailVerified){
            this.errorPrompt('Email not verified.',usrc);
          }else if(usrc.user && usrc.user.emailVerified){
            this.navCtrl.setRoot(FriendsPage);
          }
        },
        error => this.errorPrompt(error)
      );
  }

  signup(){
    this.navCtrl.push(SignupPage);
  }
  
  errorPrompt(err,chk:firebase.auth.UserCredential=null){
    if(chk){
      this.currentAlert = this.alertCtrl.create({
        title: 'Error',
        message: err,
        buttons: [{
          text: 'OK',
          role: 'cancel'
        },{
          text: 'Resend Veification Email',
          handler: () => {
            chk.user.sendEmailVerification();
          }
        }]
      })
    }else{
      this.currentAlert = this.alertCtrl.create({
        title: 'Error',
        message: err,
        buttons: ['OK']
      });
    }
    this.currentAlert.present();
  }

  forgotPassword(){
    this.currentAlert = this.alertCtrl.create({
      title: 'Reset Password',
      message: 'Please enter your email',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Reset',
          handler: data => {
            this.auth.resetEmail(data.email).then(succ => {
              this.currentAlert = this.alertCtrl.create({
                title: 'Success',
                message: 'Password resetting email sent',
                buttons: ['OK']
              });
              this.currentAlert.present();
            }, error => {
              this.errorPrompt(error);
            });
          }
        }
      ]
    });
    this.currentAlert.present();
  }
}

