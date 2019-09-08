import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {QuestionService} from '../question.service';

@Component({
  selector: 'app-level3',
  templateUrl: './level3.page.html',
  styleUrls: ['./level3.page.scss'],
})
export class Level3Page implements OnInit {

  constructor(public router: Router, public question: QuestionService) { }

  ngOnInit() {
  }

  selectLevel4(item: any) {
    this.question.setLevel3(item);
    return this.router.navigate(['/members/level4']);
  }

  select(item: any) {
    this.question.setLevel3(item);
    return this.router.navigate(['/members/new-appeal']);
  }
}
