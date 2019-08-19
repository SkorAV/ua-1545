import { Component, OnInit } from '@angular/core';
import {SignupService} from '../../../services/signup.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.page.html',
  styleUrls: ['./step2.page.scss'],
})
export class Step2Page implements OnInit {
  personType: any;

  constructor(private signupService: SignupService) { }

  ngOnInit() {
  }

  setPersonType() {
    const state = this.signupService.signupState.value;
    state.personType = this.personType;
    this.signupService.signupState.next(state);
  }

  getNextStep() {
    this.setPersonType();
    return this.personType === 'f' ? '/signup/step3-fo' : '/signup/step3-uo';
  }
}
