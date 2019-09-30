import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Appeals} from '../models/appeal';
import {Model} from '../models/model';
import {Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Profile} from '../models/profile';
import {formatDate} from '@angular/common';
import {AppealStatuses} from '../models/appeal-status';
import {AppealType} from '../models/appeal-type';
import {AppealLocations} from '../models/appeal-locations';
import {AppealStreets} from '../models/appeal-streets';
import {MyHTTPService} from './my-http.service';

// storage keys
const TOKEN_KEY = 'auth-token';
const USER_PROFILE_KEY = 'user-profile';

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
  public profile: Profile;

  public authenticationState = new BehaviorSubject(false);

  constructor(
    private http: MyHTTPService,
    public storage: Storage,
    private plt: Platform
  ) {
    this.plt.ready().then(() => {
      this.checkToken().then(() => {
        this.getUserProfileFromStorage();
      });
    });
  }

  // Sign-Up

  stepOne(email: string, password: string) {
    return this.http
      .post(API_URL + AUTH_STEP1, {email, password});
  }

  personCategories() {
    return this.http
      .get(API_URL + PERSON_CATEGORIES);
  }

  socialStatuses() {
    return this.http
      .get(API_URL + SOCIAL_STATUSES);
  }

  ownershipTypes() {
    return this.http
      .get(API_URL + OWNERSHIP_TYPES);
  }

  responsibleArea() {
    return this.http
      .get(API_URL + RESPONSIBLE_AREA);
  }

  cityStreets(cityId, query) {
    return this.http
      .get<AppealStreets>(API_URL + LOCATIONS_STREETS + cityId + '?query=' + query);
  }

  stepThree(data) {
    return this.http
      .post(API_URL + AUTH_STEP3, data);
  }

  resendPassword(email) {
    return this.http
      .post(API_URL + AUTH_RESEND, {email});
  }

  restorePassword(email) {
    return this.http
      .post(API_URL + RESTORE, {email});
  }

  changePassword(password) {
    return this.http
      .post(API_URL + CHANGE_PASSWORD, {password});
  }

  // Authentication

  public login(email: string, password: string) {
    return this.http
      .post(API_URL + AUTH_URL, {email, password});
  }

  private checkToken() {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (typeof res === 'string') {
        this.http.token = res;
        this.authenticationState.next(true);
      }
    });
  }

  public saveToken(token: any) {
    token = 'JWT ' + token;
    this.http.token = token;
    this.storage.set(TOKEN_KEY, token)
      .then(() => {})
      .catch(() => {});
    this.authenticationState.next(true);
    this.getUserProfileFromStorage();
  }

  logout() {
    return this.storage.clear().then(() => {
      this.authenticationState.next(false);
      delete this.profile;
      delete this.http.token;
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  getToken(): string {
    return this.http.token;
  }

  // Appeals

  getAppeals(page: number): Observable<Appeals> {
    if (page < 1) {
      page = 1;
    }

    return this.http
      .get<Appeals>(API_URL + APPEALS + '?page=' + page + '&per-page=11');
  }

  getAppeal(appealId: any): Observable<Model> {
    return this.http
      .get<Model>(API_URL + APPEAL_DETAILS + appealId);
  }

  getAppealsStatuses(): Observable<AppealStatuses> {
    return this.http
      .get<AppealStatuses>(API_URL + APPEAL_STATUSES);
  }

  getAppealTypesTree() {
    return this.http
      .get<AppealType[]>(API_URL + APPEAL_TYPES_TREE);
  }

  addAppeal(data: any) {
    return this.http
      .post(API_URL + APPEAL_CREATE, data);
  }

  // User profile data

  private getUserProfileFromApi(): Observable<Model> {
    return this.http
      .get<Model>(API_URL + PROFILE);
  }

  public getUserProfileFromStorage() {
    this.storage.get(USER_PROFILE_KEY).then(res => {
      if (res) {
        this.profile = res;
      } else if (this.http.token) {
        this.getUserProfileFromApi().subscribe(response => {
          this.profile = response.model;
          return this.storage.set(USER_PROFILE_KEY, this.profile);
        });
      }
    });
  }

  getUserProfile() {
    return this.profile;
  }

  // LOCATIONS

  getLocations(filter: string) {
    return this.http
      .get<AppealLocations>(API_URL + LOCATIONS_CITIES + '?query=' + filter);
  }

  getMe() {
    return this.http
      .get<Model>(API_URL + ME);
  }

  // Utils

  formatDateTime(timestamp: number, format: string): string {
    return formatDate(timestamp, format, 'uk-UA');
  }
}
