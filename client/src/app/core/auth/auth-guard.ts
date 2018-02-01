import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';
import {User} from '../../models/user';
import {UPDATE_USER} from '../shared/actions/user-actions';
import {Store} from '@ngrx/store';
import {UserState} from '../shared/stores/user-store';


// This is essentially our auth-middleware.
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<UserState>
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = JSON.parse(localStorage.getItem('user')) as User;
    const token = localStorage.getItem('token') || null;
    const isAuthorized = this.authService.isAuthorized;

    if (token) {
      this.store.dispatch({type: UPDATE_USER, payload: user});
      return true;
    } else {
      this.router.navigate(['login']);
    }
  }

}
