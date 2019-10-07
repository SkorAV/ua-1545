import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UkcApiService} from '../../services/ukc-api.service';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.page.html',
  styleUrls: ['./restore.page.scss'],
})
export class RestorePage implements OnInit {
  form: FormGroup;
  validationErrors = {
    email: [
      {type: 'required', message: 'Необхідно ввести email'},
      {type: 'email', message: 'Введено некоректний email'}
    ]
  };
  sent = false;

  constructor(public formBuilder: FormBuilder, public apiService: UkcApiService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.email, Validators.required
      ])]
    });
  }

  restore(value: any) {
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.apiService.restorePassword(value.email).then(() => {
      this.sent = true;
    });
  }
}
