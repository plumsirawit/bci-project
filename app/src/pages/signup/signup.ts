import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { PhoneUserData } from '../../models/phoneuserdata.interface';
import { FriendsPage } from '../friends/friends';

@Component({
	selector: 'page-signup',
	templateUrl: './signup.html'
})
export class SignupPage {
	signupError: string;
	form: FormGroup;

	constructor(fb: FormBuilder, private auth: AuthService, private navCtrl: NavController, private firestore: AngularFirestore) {
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
      this.navCtrl.setRoot(FriendsPage);
    }).catch(err => {
      this.signupError = err.message;
    })
  }
}