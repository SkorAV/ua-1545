import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Step3FoPage } from './step3-fo.page';
import {SignupModule} from '../signup.module/signup.module';

const routes: Routes = [
  {
    path: '',
    component: Step3FoPage
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
  declarations: [Step3FoPage]
})
export class Step3FoPageModule {}
