import { Component, OnInit } from '@angular/core';
import {UkcApiService} from '../../../services/ukc-api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordValidator} from '../../../validators/password-validator';
import {Router} from '@angular/router';
import {SignupService} from '../../../services/signup.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.page.html',
  styleUrls: ['./step1.page.scss']
})
export class Step1Page implements OnInit {
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
    public router: Router,
    public signupService: SignupService
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.email,
        Validators.required
      ])],
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

  stepTwo(value: any) {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.apiService.stepOne(value.email, value.password).subscribe(() => {
      const data = this.signupService.signupState.value;
      data.email = value.email;
      data.password = value.password;
      this.signupService.signupState.next(data);
      this.router.navigate(['signup', 'step2']);
    }, error => {
      this.setError(error.errors);
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
