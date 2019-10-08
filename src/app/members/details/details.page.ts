import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UkcApiService} from '../../services/ukc-api.service';
import {AppealDetails} from '../../models/appeal';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  appeal: AppealDetails;

  // tslint:disable-next-line:max-line-length
  constructor(private activeRoute: ActivatedRoute, private router: Router, private apiService: UkcApiService) {
  }

  ngOnInit() {
    this.apiService.getAppeal(this.activeRoute.snapshot.paramMap.get('id')).then(response => {
      try {
        const data = JSON.parse(response.data);
        this.appeal = data.model;
      } catch (e) {
        this.ngOnInit();
      }
    });
  }

  refresh() {
    this.ngOnInit();
  }
}
