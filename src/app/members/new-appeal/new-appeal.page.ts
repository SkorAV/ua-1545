import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
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
  public locations: AppealLocation[] = [];
  public selectedLocation: AppealLocation;
  appealText = '';

  constructor(private router: Router,
              public question: QuestionService,
              private apiService: UkcApiService) {
  }

  ngOnInit() {
    this.apiService.getAppealTypesTree().then(response => {
      try {
        this.question.typesTree = JSON.parse(response.data);
        this.question.setDefault();
      } catch (e) { }
    });
  }

  selectLevel1() {
    this.router.navigate(['/members/level1']);
  }

  getLocation($event) {
    const value = $event.detail.value;
    if (value.indexOf(', ') > -1) {
      this.locations = [];
      return;
    }
    if (value === '' || this.getFullLocation(this.selectedLocation) === value) {
      this.locations = [];
      return;
    }
    this.apiService.getLocations(value).then(response => {
      try {
        const data = JSON.parse(response.data);
        this.locations = data.collection;
      } catch (e) { }
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
    this.apiService.addAppeal({
      content: this.appealText,
      region: {
        value: this.selectedLocation.id,
        label: this.selectedLocation.name,
        region: this.getFullLocation(this.selectedLocation).replace(this.selectedLocation.name, '')
      },
      region_id: this.selectedLocation.id,
      source: null,
      type_id: this.question.selected.model.id
    }).then(() => {
      this.router.navigate(['members', 'dashboard']);
    });
  }
}
