import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UkcApiService} from '../../services/ukc-api.service';
import {AuthenticationService} from '../../services/authentication.service';
import {AppealDetails} from '../../models/appeal';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  appeal: AppealDetails;

  // tslint:disable-next-line:max-line-length
  constructor(private activeRoute: ActivatedRoute, private router: Router, private apiService: UkcApiService, private authService: AuthenticationService) {
    this.appeal = new AppealDetails();
  }

  ngOnInit() {
    this.apiService.getAppeal(this.activeRoute.snapshot.params.id).subscribe(response => {
      this.appeal = response.model;
    });
  }

  logout() {
    this.authService.logout();
  }

  goHome() {
    this.router.navigate(['']);
  }

  ngOn
}
