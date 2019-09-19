import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface SignupData {
  personType: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  signupState = new BehaviorSubject({} as SignupData);

  constructor() {

  }
}
