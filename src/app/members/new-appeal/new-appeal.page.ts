import {Component, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {QuestionService} from './question/question.service';
import {UkcApiService} from '../../services/ukc-api.service';
import {AppealLocation} from '../../models/appeal-locations';

@Component({
  selector: 'app-new-appeal',
  templateUrl: './new-appeal.page.html',
  styleUrls: ['./new-appeal.page.scss'],
})
export class NewAppealPage implements OnInit {
  public form: FormGroup;
  public locations: AppealLocation[];
  public selectedLocation: AppealLocation;
  appealText: any;
  uploadFiles: any;

  constructor(private router: Router,
              public question: QuestionService,
              private apiService: UkcApiService) {
    this.locations = [];
    this.appealText = '';
  }

  ngOnInit() {
    this.apiService.getAppealTypesTree().subscribe(response => {
      this.question.typesTree = response;
      this.question.setDefault();
    });
  }

  select1level1() {
    this.router.navigate(['/members/level1']);
  }

  getLocation($event) {
    if ($event.detail.value === '' || $event.detail.value.indexOf(', ') > -1) {
      this.locations = [];
      return;
    }
    this.apiService.getLocations($event.detail.value).subscribe(response => {
      this.locations = response.collection;
    });
  }

  getFullLocation(item?: AppealLocation) {
    if (!item) {
      return '';
    }
    let result = item.name;
    if (item.parents.length > 0) {
      item.parents.forEach(parent => {
        if (
          parent.type === 'адміністративний район'
          || parent.type === 'місто'
          || parent.type === 'область'
        ) {
          result += ', ' + parent.name;
        }
      });
    }
    return result;
  }

  selectLocation(item: AppealLocation) {
    this.selectedLocation = item;
    this.locations = [];
  }

  sendAppeal() {
  }
}
