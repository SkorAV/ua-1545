import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Appeals} from '../models/appeal';
import {handleError} from './error-handler.service';
import {catchError, retry} from 'rxjs/operators';
import {Model} from '../models/model';
import {Token} from '../models/token';
import {Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Profile} from '../models/profile';
import {formatDate} from '@angular/common';

// storage keys
const TOKEN_KEY = 'auth-token';
const USER_PROFILE_KEY = 'user-profile';

// urls
const API_URL = 'https://ukc.gov.ua/backend/api/';
const AUTH_URL = 'auth/login';
const APPEALS_URL = 'requests';
const APPEAL_DETAILS_URL = 'requests/view/';
const PROFILE_URL = 'profile';

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
        retry(2),
        catchError(handleError)
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
        retry(2),
        catchError(handleError)
      );
  }

  getAppeal(appealId: any): Observable<Model> {
    return this.http
      .get<Model>(API_URL + APPEAL_DETAILS_URL  + appealId)
      .pipe(
        retry(2),
        catchError(handleError)
      );
  }

  addAppeal(data: any) {}

  // User profile data

  private getUserProfileFromApi(): Observable<Model> {
    return this.http
      .get<Model>(API_URL + PROFILE_URL)
      .pipe(
        retry(2),
        catchError(handleError)
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
    this.storage.remove(USER_PROFILE_KEY);
  }

  getUserProfile() {
    return this.profile;
  }
}
