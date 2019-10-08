import { Component, OnInit } from '@angular/core';
import {UkcApiService} from '../../services/ukc-api.service';
import {Profile} from '../../models/profile';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordValidator} from '../../validators/password-validator';
import {AlertController, Platform} from '@ionic/angular';
import {User} from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: Profile;
  me: User;
  passwordChangeVisible = false;
  form: FormGroup;
  error: any = {};
  validationErrors = {
    password: [
      {type: 'required', message: 'Необхідно ввести пароль'},
      {type: 'minlength', message: 'Довжина пароля - мінімум 8 символів'},
      {type: 'maxlength', message: 'Довжина пароля - максимум 16 символів'},
      {type: 'validPassword', message: 'Пароль повинен складатись з цифр, великих та маленьких латинських літер'}
    ],
    passwordRepeat: [
      {type: 'required', message: 'Необхідно ввести пароль'},
      {type: 'mustMatch', message: 'Паролі не співпадають'}
    ]
  };

  constructor(
    public apiService: UkcApiService,
    public formBuilder: FormBuilder,
    public alert: AlertController
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
    this.form = this.formBuilder.group({
      password: ['', Validators.compose([
        Validators.minLength(8),
        Validators.maxLength(16),
        PasswordValidator.validPassword,
        Validators.required
      ])],
      passwordRepeat: ['', Validators.required]
    }, {
      validator: PasswordValidator.mustMatch('password', 'passwordRepeat')
    });
  }

  savePassword(value) {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.apiService.changePassword(value.password).then(async () => {
      await this.alert.create({
        header: 'Зміна пароля',
        message: 'Пароль було успішно змінено. Будь ласка, увійдіть у додаток знову.',
        buttons: ['OK']
      });
      await this.apiService.logout();
    }).catch(error => {
      try {
        const data = JSON.parse(error.error);
        this.setError(data.errors);
      } catch (e) {
        this.setError({type: 'unknown', message: e.message});
      }
    });
  }

  setError(errors: any) {
    for (const index in errors) {
      if (errors.hasOwnProperty(index)) {
        this.error[index] = '';
        const count = errors[index].length;
        for (let i = 0; i < count; i++) {
          this.error[index] += errors[index][i].message;
          if (i < count - 1) {
            this.error[index] += '\n';
          }
        }
      }
    }
  }

  clearError() {
    this.error = {};
  }

  getGenderName(gender: string) {
    switch (gender) {
      case 'MALE':
        return 'Чоловвік';
      case 'FEMALE':
        return 'Жінка';
    }
  }
}
