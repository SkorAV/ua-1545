import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import {Observable} from 'rxjs';
import {Appeals} from '../models/appeal';
import {EnvService, handleError} from './env.service';
import {catchError, retry} from 'rxjs/operators';
import {Model} from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class UkcApiService {
  appealsUrl = 'requests';
  appealDetailsUrl = 'requests/view/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: 'JWT ' + this.authService.getToken()
    })
  };

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  getAppeals(page: number): Observable<Appeals> {
    if (page < 1) {
      page = 1;
    }

    return this.http
      .get<Appeals>(EnvService.API_URL + this.appealsUrl + '?page=' + page, this.httpOptions)
      .pipe(
        retry(2),
        catchError(handleError)
      );
  }

  getAppeal(appealId: any) {
    return this.http
      .get<Model>(EnvService.API_URL + this.appealDetailsUrl  + appealId, this.httpOptions)
      .pipe(
        retry(2),
        catchError(handleError)
      );
  }

  addAppeal(data: any) {}
}
