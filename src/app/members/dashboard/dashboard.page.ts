import {Component, OnInit, ViewChild} from '@angular/core';
import { UkcApiService } from '../../services/ukc-api.service';
import {IonInfiniteScroll} from '@ionic/angular';
import {Router} from '@angular/router';
import {AppealStatus} from '../../models/appeal-status';
import {Appeal, Meta} from '../../models/appeal';
import {LoadingService} from '../../services/loading.service';

const APPEALS_KEY = 'appeals_data';
const STATUSES_KEY = 'statuses_data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  appealsData: Appeal[] = [];
  appealsStatuses: AppealStatus[] = [];
  selectedStatus = '';
  numberFilter = '';
  metaData: Meta;
  pageNumber = 1;

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  constructor(
    private apiService: UkcApiService,
    private router: Router,
    private loader: LoadingService) {
  }

  ngOnInit() {
    this.getAppeals();
    this.getAppealsStatuses();
  }

  async getAppeals(event?) {
    if (!event) {
      const appeals = await this.getAppealsFromStorage();
      if (appeals) {
        this.appealsData = appeals.collection;
        this.metaData = appeals.meta;
        return;
      }
    }
    await this.loader.present({
      message: 'Завантаження даних...',
      duration: 60000
    });
    this.apiService.getAppeals(this.pageNumber).then(response => {
      try {
        const data = JSON.parse(response.data);
        this.appealsData = this.appealsData.concat(data.collection);
        this.metaData = data.meta;
        this.apiService.storage.set(APPEALS_KEY, data);
        this.apiService.storage.set(APPEALS_KEY + '_time', Date.now());
        if (event) {
          event.target.complete();
        }
      } catch (e) { }
    }).finally(() => {
      this.loader.dismiss();
    });
  }

  async getAppealsFromStorage() {
    if (!await this.apiService.cacheExpired(APPEALS_KEY)) {
      return this.apiService.storage.get(APPEALS_KEY);
    }
    return false;
  }

  loadPageData(event) {
    if (this.pageNumber >= this.metaData.pagesCount) {
      event.target.disabled = true;
      return;
    }
    this.pageNumber++;
    this.getAppeals(event);
  }

  refresh() {
    this.appealsData = [];
    this.appealsStatuses = [];
    this.pageNumber = 1;
    this.apiService.storage.remove(APPEALS_KEY);
    this.apiService.storage.remove(STATUSES_KEY);
    this.getAppeals();
    this.getAppealsStatuses();
  }

  async getAppealsStatuses() {
    const statuses = await this.getAppealsStatusesFromStorage();
    if (statuses) {
      this.appealsStatuses = statuses;
      return;
    }
    await this.loader.present({
      message: 'Завантаження даних...',
      duration: 60000
    });
    this.apiService.getAppealsStatuses().then(response => {
      try {
        const data = JSON.parse(response.data);
        this.appealsStatuses = data.collection;
        this.apiService.storage.set(STATUSES_KEY, data.collection);
        this.apiService.storage.set(STATUSES_KEY + '_time', Date.now());
        const found = this.appealsStatuses.find(item => {
          return (item.value === '' && item.label === '');
        });
        if (found) {
          found.label = 'Всі статуси';
        }
      } catch (e) { }
    }).finally(() => {
      this.loader.dismiss();
    });
  }

  async getAppealsStatusesFromStorage() {
    if (!await this.apiService.cacheExpired(STATUSES_KEY)) {
      return this.apiService.storage.get(STATUSES_KEY);
    }
    return false;
  }

  loadDetails(id: string) {
    this.router.navigate(['/members/details', id]);
  }

  setStatusFilter(event: any) {
    this.selectedStatus = event.detail.value.toLowerCase();
  }

  filterAppeals() {
    if (this.selectedStatus === '' && this.numberFilter === '') {
      return this.appealsData;
    }
    return this.appealsData.filter(item => {
      if (this.selectedStatus !== '' && this.numberFilter === '') {
        return item.status.toLowerCase() === this.selectedStatus;
      }
      if (this.selectedStatus === '' && this.numberFilter !== '') {
        return item.external_id.toLowerCase().indexOf(this.numberFilter) > -1;
      }
      return item.status.toLowerCase() === this.selectedStatus && item.external_id.indexOf(this.numberFilter) > -1;
    });
  }

  setNumberFilter(event: any) {
    this.numberFilter = event.detail.value.toLowerCase();
  }
}
