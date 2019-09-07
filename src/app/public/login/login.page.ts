import { Component, OnInit } from '@angular/core';
import {UkcApiService} from '../../services/ukc-api.service';
import {Profile} from '../../models/profile';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  profile: Profile;

  constructor(private apiService: UkcApiService) { }

  ngOnInit() {
    if (this.apiService.isAuthenticated()) {
      this.profile = this.apiService.getUserProfile();
    }
  }
}
