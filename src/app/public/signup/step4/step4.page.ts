import { Component, OnInit } from '@angular/core';
import {SignupService} from '../../../services/signup.service';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.page.html',
  styleUrls: ['./step4.page.scss'],
})
export class Step4Page implements OnInit {

  constructor(private signupService: SignupService) { }

  ngOnInit() {
  }

  getBackPath(): string {
    return  this.signupService.signupState.value.personType === 'f' ? '/signup/step3_fo' : 'signup_step3_uo'
  }

}
