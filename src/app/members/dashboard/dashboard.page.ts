import {Component, OnInit, ViewChild} from '@angular/core';
import { UkcApiService } from '../../services/ukc-api.service';
import {IonInfiniteScroll} from '@ionic/angular';
import {Appeals} from '../../models/appeal';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  appealsData = [];
  metaData: any;
  pageNumber = 1;

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  constructor(private apiService: UkcApiService, private router: Router) {
  }

  ngOnInit() {
    this.getAppeals();
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
    console.log('Done');
  }

  refresh() {
    this.appealsData = [];
    this.pageNumber = 1;
    this.getAppeals();
  }

  loadDetails(id: string) {
    this.router.navigate(['/members/details', id]);
  }
}
