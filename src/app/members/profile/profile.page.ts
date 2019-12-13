import { Component, OnInit } from '@angular/core';
import {UkcApiService} from '../../services/ukc-api.service';
import {Profile} from '../../models/profile';
import {User} from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: Profile;
  me: User;

  constructor(
    public apiService: UkcApiService
  ) { }

  ngOnInit() {
    this.apiService.getUserProfileFromStorage().then(result => {
      if (result) {
        this.profile = result;
      } else {
        this.apiService.getUserProfileFromApi().then(response => {
          try {
            const data = JSON.parse(response.data);
            this.profile = data.model;
            return this.apiService.saveUserProfileToStorage(this.profile);
          } catch (e) { }
        });
      }
    });
    this.apiService.getMeFromStorage().then(result => {
      if (result) {
        this.me = result;
      } else {
        this.apiService.getMeFromApi().then(response => {
          try {
            const data = JSON.parse(response.data);
            this.me = data.model;
            return this.apiService.saveMeToStorage(this.me);
          } catch (e) { }
        });
      }
    });
  }

  getGenderName(gender: string) {
    switch (gender) {
      case 'MALE':
        return 'Чоловік';
      case 'FEMALE':
        return 'Жінка';
    }
  }
}
