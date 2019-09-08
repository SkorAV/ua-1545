import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {QuestionService} from '../question.service';

@Component({
  selector: 'app-level4',
  templateUrl: './level4.page.html',
  styleUrls: ['./level4.page.scss'],
})
export class Level4Page implements OnInit {

  constructor(public router: Router, public question: QuestionService) { }

  ngOnInit() {
  }

  select(item: any) {
    this.question.setLevel4(item);
    return this.router.navigate(['/members/new-appeal']);
  }
}
