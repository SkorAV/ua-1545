import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {QuestionService} from '../question.service';

@Component({
  selector: 'app-level2',
  templateUrl: './level2.page.html',
  styleUrls: ['./level2.page.scss'],
})
export class Level2Page implements OnInit {

  constructor(public router: Router, public question: QuestionService) { }

  ngOnInit() {
  }

  selectLevel3(item: any) {
    this.question.setLevel2(item);
    return this.router.navigate(['/members/level3']);
  }

  select(item: any) {
    this.question.setLevel2(item);
    return this.router.navigate(['/members/new-appeal']);
  }
}
