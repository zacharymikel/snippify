import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Router } from '@angular/router';
import {Registration} from '../../models/registration';
import { getApiEnvironment, getRequestOptions } from './http-utilities';
import {Store} from '@ngrx/store';
import {UserState} from '../shared/stores/user-store';
import {UPDATE_USER} from '../shared/actions/user-actions';

@Injectable()
export class AuthService {

  public isAuthorized = false;
  private env;

  constructor(
    private http: Http,
    private router: Router,
    private store: Store<UserState>
  ) {
    this.env = getApiEnvironment();
  }

  login(username: string, password: string): Promise<any> {
    return this.http.post(this.env + '/auth/login', JSON.stringify({username: username, password: password}), getRequestOptions())
      .toPromise()
      .then((res) => {
        const response = res.json();
        if (response.object.token && response.object.token.trim().length > 0) {
          localStorage.setItem('token', response.object.token);
          this.isAuthorized = true;
        }
        return res;
      })
      .catch((error) => {
        return error;
      });
  }

  logout(): void {
    this.http.get(this.env + '/auth/logout', getRequestOptions())
      .toPromise()
      .then(res => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isAuthorized = false;
        this.store.dispatch({type: UPDATE_USER, payload: null});
        this.router.navigate(['login']);
      })
      .catch(error => {
        console.error(error.toString());
      });
  }

  register(model: Registration): Promise<any> {

    return new Promise(function(resolve, reject) {
      reject('Sorry, we aren\'t accepting new user registrations at this time.');
    });

    /*return this.http.post(this.env + '/user/signup', JSON.stringify(model), getRequestOptions())
      .toPromise()
      .then(response => {
        const res = response.json();
        console.log(res);
        if (res.object && res.object.trim().length > 0) {
          localStorage.setItem('token', res.object);
          this.isAuthorized = true;
        }
        return response;
      }, err => {
        return err;
      });*/
  }
}
