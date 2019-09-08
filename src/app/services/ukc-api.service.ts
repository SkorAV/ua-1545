import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Appeals} from '../models/appeal';
import {retry} from 'rxjs/operators';
import {Model} from '../models/model';
import {Token} from '../models/token';
import {Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Profile} from '../models/profile';
import {formatDate} from '@angular/common';
import {AppealStatuses} from '../models/appeal-status';
import {AppealType} from '../models/appeal-type';
import {AppealLocations} from '../models/appeal-locations';

// storage keys
const TOKEN_KEY = 'auth-token';
const USER_PROFILE_KEY = 'user-profile';

// urls
const API_URL = 'https://ukc.gov.ua/backend/api/';
const AUTH_URL = 'auth/login';
const APPEALS_URL = 'requests';
const APPEAL_STATUSES_URL = 'requests/statuses';
const APPEAL_DETAILS_URL = 'requests/view/';
const PROFILE_URL = 'profile';
const ME_URL = 'profile/me';
const APPEAL_TYPES_TREE_URL = 'misc/appeal-types-tree';
const LOCATIONS_CITIES_URL = 'locations/cities';

@Injectable({
  providedIn: 'root'
})
export class UkcApiService {
  private token: string;
  private profile: Profile;

  public authenticationState = new BehaviorSubject(false);

  constructor(private http: HttpClient, private storage: Storage, private plt: Platform) {
    this.plt.ready().then(() => {
      this.checkToken();
      this.getUserProfileFromStorage();
    });
  }

  // Utils

  formatDateTime(timestamp: number, format: string): string {
    return formatDate(timestamp, format, 'uk-UA');
  }

  // Authentication

  private getTokenFromApi(email: string, password: string): Observable<Token> {
    return this.http
      .post<Token>(API_URL + AUTH_URL, {email, password})
      .pipe(
        retry(2)
      );
  }

  private checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
        this.token = res;
      }
    });
  }

  login(email: string, password: string) {
    this.getTokenFromApi(email, password).subscribe((response) => {
      console.log(response);
      this.token = 'JWT ' + response.token;
      this.storage.set(TOKEN_KEY, this.token);
      this.authenticationState.next(true);
      this.getUserProfileFromStorage();
    });
  }

  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
      this.deleteUserProfileFromStorage();
      delete this.profile;
      delete this.token;
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  getToken(): string {
    return this.token;
  }

  // Appeals

  getAppeals(page: number): Observable<Appeals> {
    if (page < 1) {
      page = 1;
    }

    return this.http
      .get<Appeals>(API_URL + APPEALS_URL + '?page=' + page + '&per-page=11')
      .pipe(
        retry(2)
      );
  }

  getAppeal(appealId: any): Observable<Model> {
    return this.http
      .get<Model>(API_URL + APPEAL_DETAILS_URL + appealId)
      .pipe(
        retry(2)
      );
  }

  getAppealsStatuses(): Observable<AppealStatuses> {
    return this.http
      .get<AppealStatuses>(API_URL + APPEAL_STATUSES_URL)
      .pipe(
        retry(2)
      );
  }

  getAppealTypesTree() {
    return this.http
      .get<AppealType[]>(API_URL + APPEAL_TYPES_TREE_URL)
      .pipe(
        retry(2)
      );
  }

  addAppeal(data: any) {}

  // User profile data

  private getUserProfileFromApi(): Observable<Model> {
    return this.http
      .get<Model>(API_URL + PROFILE_URL)
      .pipe(
        retry(2)
      );
  }

  private getUserProfileFromStorage() {
    this.storage.get(USER_PROFILE_KEY).then(res => {
      if (res) {
        this.profile = res;
      } else {
        this.getUserProfileFromApi().subscribe(response => {
          this.profile = response.model;
          return this.storage.set(USER_PROFILE_KEY, this.profile);
        });
      }
    });
  }

  private deleteUserProfileFromStorage() {
    return this.storage.remove(USER_PROFILE_KEY);
  }

  getUserProfile() {
    return this.profile;
  }

  // LOCATIONS
  getLocations(filter: string) {
    return this.http
      .get<AppealLocations>(API_URL + LOCATIONS_CITIES_URL + '?query=' + filter)
      .pipe(
        retry(2)
      );
  }

  getMe() {
    return this.http
      .get<Model>(API_URL + ME_URL)
      .pipe(
        retry(2)
      );
  }
}
