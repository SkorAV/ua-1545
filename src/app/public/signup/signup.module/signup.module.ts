import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PhoneFormatDirective} from '../../../directives/phone-format.directive';



@NgModule({
  declarations: [PhoneFormatDirective],
  exports: [
    PhoneFormatDirective
  ],
  imports: [
    CommonModule
  ]
})
export class SignupModule { }
