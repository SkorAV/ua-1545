import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {QuestionService} from '../question.service';
import {AppealType} from '../../../../models/appeal-type';

@Component({
  selector: 'app-level1',
  templateUrl: './level1.page.html',
  styleUrls: ['./level1.page.scss'],
})
export class Level1Page implements OnInit {

  constructor(public router: Router, public question: QuestionService) { }

  ngOnInit() {
  }

  selectLevel2(item: AppealType) {
    this.question.setLevel1(item);
    return this.router.navigate(['/members/level2']);
  }

  select(item: AppealType) {
    this.question.setLevel1(item);
    return this.router.navigate(['/members/new-appeal']);
  }
}
