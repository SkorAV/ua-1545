import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { Storage } from '@ionic/storage';

const SIGNUP_KEY = 'signup-data';

export interface SignupData {
  personType: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  signupState = new BehaviorSubject({} as SignupData);

  constructor(private storage: Storage) {

  }
}
