import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppealLocation} from '../../../models/appeal-locations';
import {AppealStreet} from '../../../models/appeal-streets';
import {UkcApiService} from '../../../services/ukc-api.service';
import {Router} from '@angular/router';
import {SignupService} from '../../../services/signup.service';

@Component({
  selector: 'app-step3-uo',
  templateUrl: './step3-uo.page.html',
  styleUrls: ['./step3-uo.page.scss'],
})
export class Step3UoPage implements OnInit {
  form: FormGroup;
  areas: any;
  organizationForms: any;
  locations: AppealLocation[];
  selectedLocation: AppealLocation;
  selectedFactLocation: AppealLocation;
  streets: AppealStreet[];
  selectedStreet: AppealStreet;
  selectedFactStreet: AppealStreet;
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
    organization_name: [
      {type: 'required', message: 'Необхідно заповнити "Назва організації"'}
    ],
    organization_form: [
      {type: 'required', message: 'Необхідно заповнити "Форма організації"'}
    ],
    edrpou: [
      {type: 'required', message: 'Необхідно заповнити "ЄДРПОУ"'},
      {type: 'pattern', message: 'Значення "ЄДРПОУ" повинно містити 8 або 10 символів'}
    ],
    registration_document_number: [
      {type: 'required', message: 'Необхідно заповнити "Номер свідоцтва про державну реєстрацію"'},
      {type: 'pattern', message: 'Номер свідоцтва про державну реєстрацію повинно містити максимум 20 цифр'}
    ],
    zip: [
      {type: 'required', message: 'Необхідно заповнити "Індекс"'},
      {type: 'pattern', message: 'Введіть п\'ять цифр'}
    ],
    city: [
      {type: 'required', message: 'Необхідно заповнити "Населений пункт"'}
    ],
    street: [
      {type: 'required', message: 'Необхідно заповнити "Вулиця"'}
    ],
    fact_zip: [
      {type: 'required', message: 'Необхідно заповнити "Індекс"'},
      {type: 'pattern', message: 'Введіть п\'ять цифр'}
    ],
    fact_city: [
      {type: 'required', message: 'Необхідно заповнити "Населений пункт"'}
    ],
    fact_street: [
      {type: 'required', message: 'Необхідно заповнити "Вулиця"'}
    ],
    phone: [
      {type: 'required', message: 'Необхідно заповнити "Контактний телефон"'},
      {type: 'pattern', message: 'Введено неправильний телефон'}
    ],
    additional_phone: [
      {type: 'pattern', message: 'Введено неправильний телефон'}
    ]
  };
  phonePattern = Validators.pattern(/^\+380\([0-9]{2}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/);
  toggled = false;

  constructor(
    public formBuilder: FormBuilder,
    public apiService: UkcApiService,
    public router: Router,
    public signupService: SignupService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      type: 'LEGAL',
      surname: ['', Validators.required],
      name: ['', Validators.required],
      patronymic: ['', Validators.required],
      area: ['', Validators.required],
      organization_name: ['', Validators.required],
      organization_form: ['', Validators.required],
      edrpou: ['', Validators.compose([
        Validators.pattern(/^[0-9]{8}$|^[0-9]{10}$/),
        Validators.required
      ])],
      registration_document_number: ['', Validators.compose([
        Validators.pattern(/^[0-9]{1,20}$/),
        Validators.required
      ])],
      zip: ['', Validators.compose([
        Validators.pattern(/^[0-9]{5}$/),
        Validators.required
      ])],
      city_text: '',
      city: ['', Validators.required],
      city_id: '',
      street_text: '',
      street: ['', Validators.required],
      street_external_id: '',
      building: '',
      flat: '',
      fact_zip: ['', Validators.compose([
        Validators.pattern(/^[0-9]{5}$/),
        Validators.required
      ])],
      fact_city_text: '',
      fact_city: ['', Validators.required],
      fact_city_id: '',
      fact_street_text: '',
      fact_street: ['', Validators.required],
      fact_street_external_id: '',
      fact_building: '',
      fact_flat: '',
      phone: ['', Validators.compose([
        Validators.required,
        this.phonePattern
      ])],
      additional_phone: ['', this.phonePattern],
      email: '',
      password: ''
    });
    this.apiService.responsibleArea().then(result => {
      try {
        this.areas = JSON.parse(result.data);
      } catch (e) { }
    });
    this.apiService.ownershipTypes().then( result => {
      try {
        this.organizationForms = JSON.parse(result.data);
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
    if (value.indexOf(',') > -1) {
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

  getFactLocation($event) {
    const value = $event.detail.value;
    if (value.length < 2) {
      return;
    }
    if (value.indexOf(',') > -1) {
      return;
    }
    if (value === '' || this.getFullLocation(this.selectedFactLocation) === value) {
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
    this.selectedStreet = null;
    this.form.get('street').setValue('');
    this.form.get('street_external_id').setValue('');
    if (this.toggled) {
      this.selectedFactLocation = {... this.selectedLocation};
      this.form.get('fact_city').setValue(this.form.get('city').value);
      this.form.get('fact_city_id').setValue(this.form.get('city_id').value);
      this.form.get('fact_city_text').setValue(this.form.get('city_text').value);
      this.selectedFactStreet = null;
      this.form.get('fact_street').setValue('');
      this.form.get('fact_street_external_id').setValue('');
    }
    this.locations = [];
    this.clearError();
  }

  selectFactLocation(item: AppealLocation) {
    if (this.selectedFactLocation && this.selectedFactLocation.id === item.id) {
      return;
    }
    this.selectedFactLocation = item;
    this.form.get('fact_city').setValue(item.name);
    this.form.get('fact_city_id').setValue(item.id);
    this.locations = [];
    this.selectedFactStreet = null;
    this.form.get('fact_street').setValue('');
    this.form.get('fact_street_external_id').setValue('');
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

  getFactStreet($event: CustomEvent) {
    const value = $event.detail.value;
    if (value.length < 2) {
      return;
    }
    if (value === '' || !this.selectedFactLocation || (this.selectedFactStreet && value === this.selectedFactStreet.model.name)) {
      this.streets = [];
      return;
    }
    this.apiService.cityStreets(this.selectedFactLocation.id, value).then(response => {
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
    if (this.toggled) {
      this.selectedFactStreet = {... this.selectedStreet};
      this.form.get('fact_street').setValue(this.form.get('street').value);
      this.form.get('fact_street_external_id').setValue(this.form.get('street_external_id').value);
      this.form.get('fact_street_text').setValue(this.form.get('street_text').value);
    }
    this.streets = [];
    this.clearError();
  }

  selectFactStreet(item: AppealStreet) {
    if (this.selectedFactStreet && this.selectedFactStreet.model.id === item.model.id) {
      return;
    }
    this.selectedFactStreet = item;
    this.form.get('fact_street').setValue(item.model.name);
    this.form.get('fact_street_external_id').setValue(item.model.id);
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
        control.markAsTouched({onlySelf: true});
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
      this.selectedLocation = null;
      this.form.get('city').setValue('');
      this.form.get('city_id').setValue('');
      this.form.get('street').setValue('');
      this.form.get('street_external_id').setValue('');
      this.selectedStreet = null;
      if (this.toggled) {
        this.selectedFactLocation = null;
        this.form.get('fact_city').setValue('');
        this.form.get('fact_city_id').setValue('');
        this.form.get('fact_street').setValue('');
        this.form.get('fact_street_external_id').setValue('');
        this.selectedFactStreet = null;
      }
    }
  }

  validateFactCitySelection() {
    if (this.form.get('fact_city_text').value && !this.selectedFactLocation) {
      this.selectedFactLocation = null;
      this.form.get('fact_city').setValue('');
      this.form.get('fact_city_id').setValue('');
      this.form.get('fact_street').setValue('');
      this.form.get('fact_street_external_id').setValue('');
      this.selectedStreet = null;
    }
  }

  validateStreetSelection() {
    if (this.form.get('street_text').value && !this.selectedStreet) {
      this.selectedStreet = null;
      this.form.get('street').setValue('');
      this.form.get('street_external_id').setValue('');
      if (this.toggled) {
        this.selectedFactStreet = null;
        this.form.get('fact_street').setValue('');
        this.form.get('fact_street_external_id').setValue('');
      }
    }
  }

  validateFactStreetSelection() {
    if (this.form.get('fact_street_text').value && !this.selectedFactStreet) {
      this.selectedFactStreet = null;
      this.form.get('fact_street').setValue('');
      this.form.get('fact_street_external_id').setValue('');
    }
  }

  zipBlur() {
    if (this.toggled) {
      this.form.get('fact_zip').setValue(this.form.get('zip').value);
    }
  }

  buildingBlur() {
    if (this.toggled) {
      this.form.get('fact_building').setValue(this.form.get('building').value);
    }
  }

  flatBlur() {
    if (this.toggled) {
      this.form.get('fact_flat').setValue(this.form.get('flat').value);
    }
  }

  toggle() {
    this.toggled = !this.toggled;
    if (this.toggled) {
      this.form.get('fact_zip').setValue(this.form.get('zip').value);
      if (this.selectedLocation) {
        this.selectedFactLocation = {... this.selectedLocation};
      }
      this.form.get('fact_city').setValue(this.form.get('city').value);
      this.form.get('fact_city_id').setValue(this.form.get('city_id').value);
      if (this.selectedStreet) {
        this.selectedFactStreet = {... this.selectedStreet};
      }
      this.form.get('fact_street').setValue(this.form.get('street').value);
      this.form.get('fact_street_external_id').setValue(this.form.get('street_external_id').value);
      this.form.get('fact_building').setValue(this.form.get('building').value);
      this.form.get('fact_flat').setValue(this.form.get('flat').value);
    }
  }
}
