import { Component, OnInit } from '@angular/core';
import {UkcApiService} from '../../services/ukc-api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Profile} from '../../models/profile';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  error: any = {};
  validationErrors = {
    email: [
      {type: 'required', message: 'Необхідно ввести email'},
      {type: 'email', message: 'Введено некоректний email'}
    ],
    password: [
      {type: 'required', message: 'Необхідно ввести пароль'},
      {type: 'minlength', message: 'Довжина пароля - мінімум 8 символів'},
      {type: 'maxlength', message: 'Довжина пароля - максимум 16 символів'}
    ]
  };
  profile: Profile;

  constructor(public apiService: UkcApiService, public formBuilder: FormBuilder, public router: Router) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.email, Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.minLength(8), Validators.maxLength(16), Validators.required
      ])]
    });
  }

  login(value: any) {
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.apiService.login(value.email, value.password).then(response => {
      // console.log(response);
      try {
        const data = JSON.parse(response.data);
        if (data.token && data.token.length > 0) {
          this.apiService.saveToken(data.token).then(() => {
            this.apiService.getUserProfileFromStorage().then(result => {
              if (result) {
                this.profile = result;
              } else {
                this.apiService.getUserProfileFromApi().then(profile => {
                  try {
                    const profileData = JSON.parse(profile.data);
                    this.profile = profileData.model;
                    return this.apiService.saveUserProfileToStorage(this.profile);
                  } catch (e) { }
                });
              }
            });
            this.router.navigate(['members', 'dashboard']);
          });
        } else {
          this.setError({password: [{message: 'Сталася невідома помилка. Будь ласка, спробуйте пізніше!'}]});
        }
      } catch (e) {
        this.setError({type: 'unknown', message: e.message});
      }
    }).catch(error => {
      // console.error(error);
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
}
