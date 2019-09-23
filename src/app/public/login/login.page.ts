import { Component, OnInit } from '@angular/core';
import {UkcApiService} from '../../services/ukc-api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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

  constructor(public apiService: UkcApiService, public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (this.apiService.isAuthenticated()) {
      this.apiService.getUserProfileFromStorage();
    }
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
    this.apiService.login(value.email, value.password).subscribe((response) => {
      this.apiService.saveToken(response.token);
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
