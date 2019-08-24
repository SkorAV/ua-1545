import { Component, OnInit } from '@angular/core';
import {UkcApiService} from '../../services/ukc-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: UkcApiService) { }

  ngOnInit() {
  }
}
