import {Component, OnInit, ViewChild} from '@angular/core';
import { UkcApiService } from '../../services/ukc-api.service';
import {IonInfiniteScroll} from '@ionic/angular';
import {Router} from '@angular/router';
import {AppealStatus} from '../../models/appeal-status';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  appealsData = [];
  appealsStatuses: AppealStatus[] = [];
  selectedStatus = '';
  numberFilter = '';
  metaData: any;
  pageNumber = 1;

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  constructor(private apiService: UkcApiService, private router: Router) {
  }

  ngOnInit() {
    this.getAppeals();
    this.getAppealsStatuses();
  }

  getAppeals(event?) {
    this.apiService.getAppeals(this.pageNumber).subscribe(response => {
      this.appealsData = this.appealsData.concat(response.collection);
      this.metaData = response.meta;
      if (event) {
        event.target.complete();
      }
    });
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
    this.pageNumber = 1;
    this.getAppeals();
  }

  getAppealsStatuses() {
    this.apiService.getAppealsStatuses().subscribe(response => {
      this.appealsStatuses = response.collection;

      const found = this.appealsStatuses.find(item => {
        return (item.value === '' && item.label === '');
      });

      if (found) {
        found.label = 'Всі статуси';
      }
    });
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
