import {Component, OnInit, ViewChild} from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { UkcApiService } from '../../services/ukc-api.service';
import {IonInfiniteScroll} from '@ionic/angular';
import {Appeals} from '../../models/appeal';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  appealsData: Appeals;

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  constructor(private authService: AuthenticationService, public apiService: UkcApiService, private router: Router) {
    this.appealsData = new Appeals();
  }

  ngOnInit() {
    this.getAllAppeals();
  }

  getAllAppeals(page: number = 1) {
    this.apiService.getAppeals(page).subscribe(response => {
      console.log(response);
      this.appealsData = response;
    });
  }

  logout() {
    this.authService.logout();
  }

  loadData($event) {
    setTimeout(() => {
      console.log('Done');
      $event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.appealsData.meta.pagesCount == this.appealsData.meta.pageNumber) {
        $event.target.disabled = true;
      }
    }, 500);
  }

  loadDetails(id: string) {
    this.router.navigate(['/members/details', id]);
  }
}
