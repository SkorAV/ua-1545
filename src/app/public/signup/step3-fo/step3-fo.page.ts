import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UkcApiService} from '../../../services/ukc-api.service';
import {Router} from '@angular/router';
import {AppealLocation} from '../../../models/appeal-locations';
import {AppealStreet} from '../../../models/appeal-streets';
import {SignupService} from '../../../services/signup.service';

@Component({
  selector: 'app-step3-fo',
  templateUrl: './step3-fo.page.html',
  styleUrls: ['./step3-fo.page.scss'],
})
export class Step3FoPage implements OnInit {
  form: FormGroup;
  socialStatuses: any;
  personCategories: any;
  locations: AppealLocation[];
  selectedLocation: AppealLocation;
  streets: AppealStreet[];
  selectedStreet: AppealStreet;
  error: any = {};
  validationErrors = {
    surname: [
      {type: 'required', message: 'Необхідно заповнити "Прізвище"'}
    ],
    name: [
      {type: 'required', message: 'Необхідно заповнити "Ім\'я"'}
    ],
    patronymic: [
      {type: 'required', message: 'Необхідно заповнити "По батькові"'}
    ],
    gender: [
      {type: 'required', message: 'Необхідно вказати "Стать"'}
    ],
    phone: [
      {type: 'required', message: 'Необхідно заповнити "Контактний телефон"'},
      {type: 'pattern', message: 'Введено неправильний телефон'}
    ],
    additional_phone: [
      {type: 'pattern', message: 'Введено неправильний телефон'}
    ],
    zip: [
      {type: 'required', message: 'Необхідно заповнити "Індекс"'},
      {type: 'pattern', message: 'Введіть п\'ять цифр'}
    ],
    city_text: [
      {type: 'required', message: 'Необхідно заповнити "Населений пункт"'}
    ],
    street_text: [
      {type: 'required', message: 'Необхідно заповнити "Вулиця"'}
    ]
  };
  phonePattern = Validators.pattern(/^\+380\([0-9]{2}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/);

  constructor(
    public formBuilder: FormBuilder,
    public apiService: UkcApiService,
    public router: Router,
    public signupService: SignupService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      type: 'PHYSICAL',
      surname: ['', Validators.required],
      name: ['', Validators.required],
      patronymic: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.compose([
        Validators.required,
        this.phonePattern
      ])],
      additional_phone: ['', this.phonePattern],
      social_type: '',
      category: '',
      zip: ['', Validators.compose([
        Validators.pattern(/^[0-9]{5}$/),
        Validators.required
      ])],
      city_text: ['', Validators.required],
      city: '',
      city_id: '',
      street_text: ['', Validators.required],
      street: '',
      street_external_id: '',
      building: '',
      flat: '',
      email: '',
      password: ''
    });
    this.apiService.socialStatuses().then(result => {
      try {
        this.socialStatuses = JSON.parse(result.data);
      } catch (e) { }
    });
    this.apiService.personCategories().then( result => {
      try {
        this.personCategories = JSON.parse(result.data);
      } catch (e) { }
    });
    this.locations = [];
    this.streets = [];
  }

  getLocation($event) {
    const value = $event.detail.value;
    if (value.length < 2) {
      return;
    }
    if (value.indexOf(', ') > -1) {
      this.locations = [];
      return;
    }
    if (value === '' || this.getFullLocation(this.selectedLocation) === value) {
      this.locations = [];
      return;
    }
    this.apiService.getLocations(value).then(response => {
      try {
        const data = JSON.parse(response.data);
        this.locations = data.collection;
      } catch (e) { }
    });
  }

  getFullLocation(item?: AppealLocation) {
    if (!item) {
      return '';
    }
    let result = item.name;
    if (item.parents.length > 0) {
      item.parents.forEach(parent => {
        if (
          parent.type === 'адміністративний район'
          || parent.type === 'місто'
          || parent.type === 'область'
        ) {
          result += ', ' + parent.name;
        }
      });
    }
    return result;
  }

  selectLocation(item: AppealLocation) {
    if (this.selectedLocation && this.selectedLocation.id === item.id) {
      return;
    }
    this.selectedLocation = item;
    this.form.get('city').setValue(item.name);
    this.form.get('city_id').setValue(item.id);
    this.locations = [];
    this.selectedStreet = null;
    this.form.get('street').setValue('');
    this.form.get('street_external_id').setValue('');
    this.clearError();
  }

  getStreet($event: CustomEvent) {
    const value = $event.detail.value;
    if (value.length < 2) {
      return;
    }
    if (value === '' || !this.selectedLocation || (this.selectedStreet && value === this.selectedStreet.model.name)) {
      this.streets = [];
      return;
    }
    this.apiService.cityStreets(this.selectedLocation.id, value).then(response => {
      try {
        const data = JSON.parse(response.data);
        this.streets = data.collection;
      } catch (e) { }
    });
  }

  selectStreet(item: AppealStreet) {
    if (this.selectedStreet && this.selectedStreet.model.id === item.model.id) {
      return;
    }
    this.selectedStreet = item;
    this.form.get('street').setValue(item.model.name);
    this.form.get('street_external_id').setValue(item.model.id);
    this.streets = [];
    this.clearError();
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

  step4(value: any) {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    value.email = this.signupService.signupState.value.email;
    value.password = this.signupService.signupState.value.password;
    this.apiService.stepThree(value).then(() => {
      this.router.navigate(['signup', 'step4']);
    }).catch(error => {
      try {
        const data = JSON.parse(error.error);
        this.setError(data.errors);
      } catch (e) {
        this.setError({type: 'unknown', message: e.message});
      }
    });
  }

  validateCitySelection() {
    if (this.form.get('city_text').value && !this.selectedLocation) {
      this.form.get('city').setValue('');
      this.form.get('city_id').setValue('');
      this.form.get('street').setValue('');
      this.form.get('street_external_id').setValue('');
      this.selectedStreet = null;
    }
  }

  validateStreetSelection() {
    if (this.form.get('street_text').value && !this.selectedStreet) {
      this.form.get('street').setValue('');
      this.form.get('street_external_id').setValue('');
    }
  }
}
