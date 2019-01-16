import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, Alert } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { PhoneUserData } from '../../models/phoneuserdata.interface';

@Component({
	selector: 'page-signup',
	templateUrl: './signup.html'
})
export class SignupPage {
	form: FormGroup;
  currentAlert: Alert;
	constructor(fb: FormBuilder, private auth: AuthService, public alertCtrl: AlertController, private firestore: AngularFirestore) {
		this.form = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
		});
  }

  signup() {
    let data = this.form.value;
    let credentials = {
      email: data.email,
      password: data.password
    };
    this.auth.signUp(credentials).then(a => {
      this.firestore.collection<PhoneUserData>('phone_users').add({
        UID: a.user.uid,
        conn: []
      });
      a.user.sendEmailVerification();
      this.errorPrompt('A verificaiton email has been sent to your email. Please verify your email.', true);
    }).catch(err => {
      this.errorPrompt(err.message);
    })
  }

  errorPrompt(err, chk=false) {
    this.currentAlert = this.alertCtrl.create({
      title: chk ? 'Email Verification' : 'Error',
      message: err,
      buttons: ['OK']
    });
    this.currentAlert.present();
  }
}