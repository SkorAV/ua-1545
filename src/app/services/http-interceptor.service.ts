import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UkcApiService} from './ukc-api.service';
import {catchError, map} from 'rxjs/operators';
import {LoadingController} from '@ionic/angular';
import {handleError} from './error-handler.service';
import {LoadingService} from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  loaderToShow: any;
  isShowing = true;

  constructor(
    private apiService: UkcApiService,
    public loadingController: LoadingController,
    public loadingService: LoadingService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.apiService.getToken();

    // Authentication by setting header with token value
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: token
        }
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }

    this.loadingService.present({message: 'Синхронізація з сервером...'});

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        this.loadingService.dismiss();
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        this.loadingService.dismiss();
        return handleError(error);
      })
    );
  }

  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Завантаження...',
      duration: 1000
    }).then((res) => {
      res.present();
      this.isShowing = true;

      res.onDidDismiss().then(() => {
        this.isShowing = false;
      });
    });
    this.hideLoader();
  }

  hideLoader() {
    if (!this.isShowing) {
      return;
    }
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 2000);
  }
}
