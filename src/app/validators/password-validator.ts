import {FormControl, FormGroup} from '@angular/forms';

export class PasswordValidator {
  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  static validPassword(fc: FormControl) {
    if (
      !/[0-9]+/.test(fc.value)
      || !/[a-z]+/.test(fc.value)
      || !/[A-Z]+/.test(fc.value)
      || /[^0-9a-zA-Z]/.test(fc.value)) {
      return {
        validPassword: true
      };
    }
    return null;
  }
}
