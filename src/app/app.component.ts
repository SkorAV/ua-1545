import { Component } from '@angular/core';

import { NavController, Platform, ToastController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { UkcApiService } from './services/ukc-api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  counter = 0;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: UkcApiService,
    private router: Router,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      authenticationService.authenticationState.subscribe(state => {
        if (state) {
          router.navigate(['members', 'dashboard']);
        } else {
          router.navigate(['login']);
        }
      });
      platform.backButton.subscribeWithPriority(0, () => {
        // console.log(router.url);
        if (router.url !== '/login') {
          navCtrl.back({animationDirection: 'back'});
          return;
        }
        if (this.counter === 0) {
          this.counter++;
          this.presentToast();
          setTimeout(() => { this.counter = 0; }, 3000);
        } else {
          navigator['app'].exitApp();
        }
      });
    });
  }

  presentToast() {
    this.toastCtrl.create({
      message: 'Натисніть ще раз, щоб вийти',
      duration: 3000
    }).then(toast => {
      toast.present();
    });
  }
}
