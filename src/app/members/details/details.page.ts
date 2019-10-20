import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UkcApiService} from '../../services/ukc-api.service';
import {AppealDetails} from '../../models/appeal';
import {LoadingService} from '../../services/loading.service';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

const APPEAL_KEY = 'appeal_'; // ass the ID here

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  appealId: any;
  appeal: AppealDetails;

  // tslint:disable-next-line:max-line-length
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private apiService: UkcApiService,
    private loader: LoadingService,
    private inAppBrowser: InAppBrowser) {
  }

  async ngOnInit() {
    this.appealId = this.activeRoute.snapshot.paramMap.get('id');
    let data = await this.getAppealFromStorage();
    if (data) {
      this.appeal = data;
      return;
    }
    await this.loader.present({
      message: 'Завантаження даних...',
      duration: 60000
    });
    this.apiService.getAppeal(this.appealId).then(response => {
      try {
        data = JSON.parse(response.data);
        this.appeal = data.model;
        this.apiService.storage.set(APPEAL_KEY + this.appealId, data.model);
        this.apiService.storage.set(APPEAL_KEY + this.appealId + '_time', Date.now());
      } catch (e) { }
    }).finally(() => {
      this.loader.dismiss();
    });
  }

  async getAppealFromStorage() {
    if (!await this.apiService.cacheExpired(APPEAL_KEY + this.appealId)) {
      return this.apiService.storage.get(APPEAL_KEY + this.appealId);
    }
    return false;
  }

  refresh() {
    this.apiService.storage.remove(APPEAL_KEY + this.appealId).then(() => {
      this.ngOnInit();
    });
  }

  show(url: string) {
    const browser = this.inAppBrowser.create(url, '_system');
  }
}
