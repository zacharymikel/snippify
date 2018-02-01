import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth-service';
import {Router} from '@angular/router';
import {UserService} from '../auth/user-service';
import {Title} from '@angular/platform-browser';
import {ToasterService} from 'angular2-toaster';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public model: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private titleService: Title,
    private userService: UserService,
    private toastService: ToasterService
  ) {

  }

  ngOnInit() {
    this.titleService.setTitle('Login');
  }

  login(): void {
    this.authService.login(this.model.username, this.model.password).then((res) => {
      if (res.status === 200) {
        this.getUserProfile();
      } else {
        this.displayError(res.json().errors[0]);
      }
    }, (error) => {
      console.log(error);
    });
  }

  getUserProfile(): Promise<any> {
    return this.userService.getUser().then(() => {
      this.router.navigate(['']).then((res) => {
        return res;
      });
    });
  }

  displayError(errorMessage: string): void {
    this.toastService.pop('error', 'Error', errorMessage);
  }

}
