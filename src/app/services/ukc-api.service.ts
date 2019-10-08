import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Profile} from '../models/profile';
import {formatDate} from '@angular/common';
import {HTTP} from '@ionic-native/http/ngx';
import {User} from '../models/user';

// storage keys
const TOKEN_KEY = 'auth-token';
const USER_PROFILE_KEY = 'user-profile';
const ME_KEY = 'me';

// urls
const API_URL = 'https://ukc.gov.ua/backend/api/';
const AUTH_URL = 'auth/login';
const AUTH_STEP1 = 'auth/step-one';
const PERSON_CATEGORIES = 'misc/person-categories';
const SOCIAL_STATUSES = 'misc/social-statuses';
const OWNERSHIP_TYPES = 'misc/ownershipment-types';
const RESPONSIBLE_AREA = 'misc/responsible-area';
const AUTH_STEP3 = 'auth/signup';
const AUTH_RESEND = 'auth/resend';
const RESTORE = 'restore';
const APPEALS = 'requests';
const APPEAL_STATUSES = 'requests/statuses';
const APPEAL_DETAILS = 'requests/view/';
const APPEAL_CREATE = 'requests/create';
const PROFILE = 'profile';
const ME = 'profile/me';
const CHANGE_PASSWORD = 'profile/password';
const APPEAL_TYPES_TREE = 'misc/appeal-types-tree';
const LOCATIONS_CITIES = 'locations/cities';
const LOCATIONS_STREETS = 'locations/streets/';

@Injectable({
  providedIn: 'root'
})
export class UkcApiService {
  private headers: any = {};
  private token: string = null;

  public authenticationState = new BehaviorSubject(false);

  constructor(
    private http: HTTP,
    public storage: Storage,
    private plt: Platform
  ) {
    this.plt.ready().then(() => {
      return this.checkToken();
    });
  }

  // Sign-Up

  stepOne(email: string, password: string) {
    return this.http
      .post(API_URL + AUTH_STEP1, {email, password}, this.headers);
  }

  personCategories() {
    return this.http
      .get(API_URL + PERSON_CATEGORIES, {}, this.headers);
  }

  socialStatuses() {
    return this.http
      .get(API_URL + SOCIAL_STATUSES, {}, this.headers);
  }

  ownershipTypes() {
    return this.http
      .get(API_URL + OWNERSHIP_TYPES, {}, this.headers);
  }

  responsibleArea() {
    return this.http
      .get(API_URL + RESPONSIBLE_AREA, {}, this.headers);
  }

  cityStreets(cityId, query) {
    return this.http
      .get(API_URL + LOCATIONS_STREETS + cityId + '?query=' + query, {}, this.headers);
  }

  stepThree(data) {
    return this.http
      .post(API_URL + AUTH_STEP3, data, this.headers);
  }

  resendPassword(email) {
    return this.http
      .post(API_URL + AUTH_RESEND, {email}, this.headers);
  }

  restorePassword(email) {
    return this.http
      .post(API_URL + RESTORE, {email}, this.headers);
  }

  changePassword(password) {
    return this.http
      .post(API_URL + CHANGE_PASSWORD, {password}, this.headers);
  }

  // Authentication

  public login(email: string, password: string) {
    this.http.setDataSerializer('json');
    return this.http
      .post(API_URL + AUTH_URL, {email, password}, this.headers);
  }

  private checkToken() {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (typeof res === 'string') {
        this.authenticationState.next(true);
        this.token = res;
        this.headers.authorization = res;
      }
    });
  }

  public async saveToken(token: any) {
    token = 'JWT ' + token;
    this.authenticationState.next(true);
    this.token = token;
    await this.storage.set(TOKEN_KEY, token);
    this.headers.authorization = token;
  }

  logout() {
    return this.storage.clear().then(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  getToken(): string {
    return this.token;
  }

  // Appeals

  getAppeals(page: number) {
    if (page < 1) {
      page = 1;
    }

    return this.http
      .get(API_URL + APPEALS + '?page=' + page, {}, this.headers);
  }

  getAppeal(appealId: any) {
    return this.http
      .get(API_URL + APPEAL_DETAILS + appealId, {}, this.headers);
  }

  getAppealsStatuses() {
    return this.http
      .get(API_URL + APPEAL_STATUSES, {}, this.headers);
  }

  getAppealTypesTree() {
    return this.http
      .get(API_URL + APPEAL_TYPES_TREE, {}, this.headers);
  }

  addAppeal(data: any) {
    return this.http
      .post(API_URL + APPEAL_CREATE, data, this.headers);
  }

  // User profile data

  getUserProfileFromApi() {
    return this.http
      .get(API_URL + PROFILE, {}, this.headers);
  }

  getUserProfileFromStorage() {
    return this.storage.get(USER_PROFILE_KEY);
  }

  saveUserProfileToStorage(profile: Profile) {
    return this.storage.set(USER_PROFILE_KEY, profile);
  }

  getMeFromApi() {
    return this.http.get(API_URL + ME, {}, this.headers);
  }

  getMeFromStorage() {
    return this.storage.get(ME_KEY);
  }

  saveMeToStorage(me: User) {
    return this.storage.set(ME_KEY, me);
  }

  // LOCATIONS

  getLocations(filter: string) {
    return this.http
      .get(API_URL + LOCATIONS_CITIES + '?query=' + filter, {}, this.headers);
  }

  // Utils

  formatDateTime(timestamp: number, format: string): string {
    return formatDate(timestamp, format, 'uk-UA');
  }
}
