import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {UkcApiService} from '../services/ukc-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public auth: UkcApiService) { }

  canActivate(): boolean {
    return this.auth.isAuthenticated();
  }
}
