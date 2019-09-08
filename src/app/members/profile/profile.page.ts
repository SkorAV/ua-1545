import { Component, OnInit } from '@angular/core';
import {UkcApiService} from '../../services/ukc-api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  me: any;
  passwordChangeVisible = false;
  password: any;
  passwordRepeat: any;

  constructor(public apiService: UkcApiService) { }

  ngOnInit() {
    this.apiService.getMe().subscribe(response => {
      this.me = response.model;
    });
  }

  savePassword() {

  }
}
