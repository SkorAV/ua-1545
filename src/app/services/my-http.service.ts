import {Injectable} from '@angular/core';
import {HTTP} from '@ionic-native/http/ngx';
import {LoadingService} from './loading.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyHTTPService {
  private pToken: string = null;

  constructor(private nativeHttp: HTTP, private loader: LoadingService) {
  }

  setCommonOptions() {
    this.nativeHttp.setHeader('*', 'Content-Type', 'application/json');

    this.nativeHttp.setHeader('*', 'Accept', 'application/json');
    this.nativeHttp.setHeader('*', 'Cache-Control', 'no-cache');

    this.nativeHttp.setDataSerializer('json');
    this.nativeHttp.setRequestTimeout(30);
  }

  set token(value: string) {
    this.pToken = value;
    this.nativeHttp.setHeader('*', 'authorization', value);
  }

  get token(): string {
    return this.pToken;
  }

  public get<T>(url: string): Observable<any> {
    this.setCommonOptions();
    return new Observable<T>(observer => {
      this.loader.present({message: 'Синхронізація з сервером...', duration: 30000});
      this.nativeHttp.get(url, {}, {}).then(response => {
        try {
          const parsedResponse = JSON.parse(response.data);
          observer.next(parsedResponse);
        } catch (e) {
          observer.error('JSON parsing error');
        }
        observer.complete();
      }).catch(error => {
        let parsedError = {};
        try {
          parsedError = JSON.parse(error.error);
        } catch (e) {
          parsedError = {json_parse_error: 'JSON Parse Error'};
        }
        observer.error(parsedError);
        observer.complete();
      }).finally(() => {
        observer.unsubscribe();
        this.loader.dismiss();
      });
    });
  }

  public post<T>(url: string, data: any = {}): Observable<any> {
    this.setCommonOptions();
    return new Observable<T>(observer => {
      this.loader.present({message: 'Синхронізація з сервером...', duration: 30000});
      this.nativeHttp.post(url, data, {}).then(response => {
        try {
          const parsedResponse = JSON.parse(response.data);
          observer.next(parsedResponse);
        } catch (e) {
          observer.error('JSON parsing error');
        }
        observer.complete();
      }).catch(error => {
        let parsedError = {};
        try {
          parsedError = JSON.parse(error.error);
        } catch (e) {
          parsedError = {json_parse_error: 'JSON Parse Error'};
        }
        observer.error(parsedError);
        observer.complete();
      }).finally(() => {
        observer.unsubscribe();
        this.loader.dismiss();
      });
    });
  }
}
