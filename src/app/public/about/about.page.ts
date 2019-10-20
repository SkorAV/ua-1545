import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  version: string;
  appName: string;

  constructor(
    private ver: AppVersion
  ) { }

  ngOnInit() {
    this.ver.getVersionNumber().then(value => {
      this.version = value;
    });
    this.ver.getAppName().then(value => {
      this.appName = value;
    });
  }

}
