import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Step3UoPage } from './step3-uo.page';
import {SignupModule} from '../signup.module/signup.module';

const routes: Routes = [
  {
    path: '',
    component: Step3UoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SignupModule
  ],
  declarations: [Step3UoPage]
})
export class Step3UoPageModule {}
