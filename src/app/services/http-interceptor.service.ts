import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UkcApiService} from './ukc-api.service';
import {catchError, finalize, map} from 'rxjs/operators';
import {LoadingController} from '@ionic/angular';
import {handleError} from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  loaderToShow: any;
  isShowing = true;

  constructor(private apiService: UkcApiService, public loadingController: LoadingController) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.apiService.getToken();
    console.log('Executing request: ', request.method, request.url, request.params, request.body);

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

    this.showLoader();

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('Response Received:', event);
        }

        this.hideLoader();

        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        this.hideLoader();

        return handleError(error);
      })
    );
  }

  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Завантаження...'
    }).then((res) => {
      res.present();
      this.isShowing = true;

      res.onDidDismiss().then((dis) => {
        this.isShowing = false;
        console.log('Loading dismissed!', dis);
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
