import { Component } from '@angular/core';

import { NavController, Platform, ToastController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, RouterEvent } from '@angular/router';
import { UkcApiService } from './services/ukc-api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  counter = 0;

  pages = [
    {
      title: 'Увійти',
      url: 'login',
      authOnly: false
    },
    {
      title: 'Зареєструватись',
      url: 'signup',
      authOnly: false
    },
    {
      title: 'Відновити пароль',
      url: 'restore',
      authOnly: false
    },
    {
      title: 'Мої звернення',
      url: 'members/dashboard',
      authOnly: true
    },
    {
      title: 'Подати звернення',
      url: 'members/new-appeal',
      authOnly: true
    },
    {
      title: 'Профіль',
      url: 'members/profile',
      authOnly: true
    },
    {
      title: 'Змінити пароль',
      url: 'members/change-password',
      authOnly: true
    },
    {
      title: 'Допомога',
      url: 'help',
      authOnly: null
    },
    {
      title: 'Інформація',
      url: 'about',
      authOnly: null
    },
    {
      title: 'Вихід',
      url: 'login',
      authOnly: true
    },
  ];
  selectedUrl = '';

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
      // for Black
      if(this.platform.is('android')) {
        this.statusBar.styleLightContent();
        this.statusBar.backgroundColorByHexString('005b85');
      }
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
    router.events.subscribe((event: RouterEvent) => {
      this.selectedUrl = event.url;
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
