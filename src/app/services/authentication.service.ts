import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { EnvService, handleError } from './env.service';
import { Token } from '../models/token';
import { retry, catchError } from 'rxjs/operators';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authUrl = 'auth/login';
  authenticationState = new BehaviorSubject(false);
  token: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private storage: Storage, private plt: Platform, private http: HttpClient) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  // Create a new item
  getTokenFromApi(email: string, password: string): Observable<Token> {
    return this.http
      .post<Token>(EnvService.API_URL + this.authUrl, {email, password}, this.httpOptions)
      .pipe(
        retry(2),
        catchError(handleError)
      )
  }

  login(email: string, password: string) {
    this.getTokenFromApi(email, password).subscribe((response) => {
      console.log(response);
      this.token = response.token;
      this.storage.set(TOKEN_KEY, this.token);
      this.authenticationState.next(true);
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
        this.token = res;
      }
    });
  }

  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
      delete this.token;
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  getToken(): string {
    return this.token;
  }
}
