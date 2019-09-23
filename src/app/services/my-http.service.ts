import {Injectable} from '@angular/core';
import {HTTP} from '@ionic-native/http/ngx';
import {LoadingService} from './loading.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyHTTPService {
  private pToken: string = null;

  constructor(private nativeHttp: HTTP, private loader: LoadingService) {}

  set token(value: string) {
    this.pToken = value;
  }

  get token(): string {
    return this.pToken;
  }

  public get<T>(url: string): Observable<any> {
    let headers = {};
    if (this.token) {
      headers = {Authorization: this.token};
    }
    this.loader.present({message: 'Синхронізація з серверомююю'});
    return new Observable<T>(observer => {
      this.nativeHttp.get(url, {}, headers).then(response => {
        const parsedResponse = JSON.parse(response.data);
        observer.next(parsedResponse);
        observer.complete();
      }).catch(error => {
        const parsedError = JSON.parse(error.error);
        observer.error(parsedError);
        observer.complete();
      }).finally(() => {
        this.loader.dismiss();
      });
    });
  }

  public post<T>(url: string, data: any = {}): Observable<any> {
    let headers = {};
    if (this.token) {
      headers = {Authorization: this.token};
    }
    this.loader.present({message: 'Синхронізація з серверомююю'});
    return new Observable<T>(observer => {
      this.nativeHttp.post(url, data, headers).then(response => {
        const parsedResponse = JSON.parse(response.data);
        observer.next(parsedResponse);
        observer.complete();
      }).catch(error => {
        const parsedError = JSON.parse(error.error);
        observer.error(parsedError);
        observer.complete();
      }).finally(() => {
        this.loader.dismiss();
      });
    });
  }
}
