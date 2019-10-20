import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UkcApiService} from '../../services/ukc-api.service';
import {AlertController} from '@ionic/angular';
import {PasswordValidator} from '../../validators/password-validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
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
}
