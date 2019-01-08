import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { BCIUserData } from '../../models/bciuserdata.interface';
import { AuthService } from '../../services/auth.service';
import { PhoneUserData } from '../../models/phoneuserdata.interface';
import { map } from 'rxjs/operators';
@Component({
  selector: 'page-addfriend',
  templateUrl: 'addfriend.html'
})
export class AddFriendPage {
  did: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private firestore: AngularFirestore, public alertCtrl: AlertController, private auth: AuthService) {
    this.did = "";
  }
  connect(){
    this.firestore.collection<BCIUserData>('bci_users', ref => ref.where('id','==',this.did)).valueChanges().subscribe(e => {
      if(e.length == 0){
        this.alertCtrl.create({
          title: 'Invalid Data!',
          subTitle: 'The given ID cannot be found. Please recheck your ID.',
          buttons: ['OK']
        }).present();
      }else if(e.length == 1){
        var curdid = this.did;
        this.firestore.collection<PhoneUserData>('phone_users',ref => ref.where('UID','==',this.auth.getUID())).snapshotChanges().map(actions => 
          actions.map(a => {
            console.log('[DEBUG]');
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          })
        ).subscribe(b => {
          if(curdid != ""){
            b.forEach(dat => {
              var tconn = dat.conn;
              var dup = false;
              tconn.forEach(function(value: string, index: number, array: string[]){
                if(value == curdid){
                  dup = true;
                }
              });
              if(!dup){
                tconn.push(curdid);
                this.firestore.doc<PhoneUserData>('phone_users/' + dat.id).update({
                  conn: tconn,
                });
              }else{
                this.alertCtrl.create({
                  title: 'Invalid Data!',
                  subTitle: 'Device already added.',
                  buttons: ['OK'],
                }).present();
              }
            });
            curdid = "";
          }
        });  
      }else{
        this.alertCtrl.create({
          title: 'Invalid Data!',
          subTitle: 'Duplicated Devices Found. Please report this to the application developers.',
          buttons: ['OK']
        }).present();
      }
    });
    this.navCtrl.pop();
  }
}
