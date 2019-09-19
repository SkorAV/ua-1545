import { Component, OnInit } from '@angular/core';
import {SignupService} from '../../../services/signup.service';
import {UkcApiService} from '../../../services/ukc-api.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.page.html',
  styleUrls: ['./step4.page.scss'],
})
export class Step4Page implements OnInit {

  constructor(
    private signupService: SignupService,
    public apiService: UkcApiService,
    public toast: ToastController
  ) { }

  ngOnInit() {
  }

  getBackPath(): string {
    return  this.signupService.signupState.value.personType === 'f' ? '/signup/step3_fo' : 'signup/step3_uo';
  }

  sendAgain() {
    this.apiService.resendPassword(this.signupService.signupState.value.email).subscribe(() => {
      this.toast.create({
        header: 'Успіх',
        message: 'Лист для підтверження реєстрації було відправлено повторно',
        duration: 5000,
        color: 'success'
      }).then(toast => {
        toast.present();
      });
    }, () => {
      this.toast.create({
        header: 'Помилка',
        message: 'Виникла помилка під час повторного надсилання листа для підтверження реєстрації',
        duration: 5000,
        color: 'danger'
      }).then(toast => {
        toast.present();
      });
    });
  }
}
