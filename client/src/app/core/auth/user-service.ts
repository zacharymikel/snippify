import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Http } from '@angular/http';
import { User } from '../../models/User';
import {getApiEnvironment, getFileUploadRequestOptions, getRequestOptions} from './http-utilities';
import { Store } from '@ngrx/store';
import { UserState } from '../shared/stores/user-store';
import { UPDATE_USER } from '../shared/actions/user-actions';
import {Settings} from '../../models/settings';
import {Form} from '@angular/forms';

@Injectable()
export class UserService {
  private env: string;
  private userId: number;

  constructor(
    private http: Http,
    private store: Store<UserState>
  ) {
    this.env = getApiEnvironment();
  }

  getUser(): Promise<any> {
    return this.http.get(this.env + '/user', getRequestOptions()).toPromise().then(res => {
      const response = res.json();
      const user = response.object as User;
      localStorage.setItem('user', JSON.stringify(user));
      this.store.dispatch({type: UPDATE_USER, payload: user});
      return res;
    });
  }

  updateUser(user: Settings): Promise<any> {
    const formData: FormData = new FormData();
    formData.append('username', user.username);
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('bio', user.bio);
    formData.append('profile', user.profile);
    formData.append('banner', user.banner);
    formData.append('websiteUrl', user.websiteUrl);
    return this.http.put(this.env + '/user', formData , getFileUploadRequestOptions())
      .toPromise()
      .then(res => {
        if (res.status === 200) {
          const response = res.json();
          const newUserData = response.object as User;
          localStorage.setItem('user', JSON.stringify(newUserData));
          this.store.dispatch({type: UPDATE_USER, payload: newUserData});
        }
        return res;
      }, error => {
        return error;
    });
  }

  followUser(id: number): Promise<any> {
    return this.http.get(this.env + '/user/follow?followUserId=' + id, getRequestOptions()).toPromise();
  }

  unfollowUser(id: number): Promise<any> {
    return this.http.get(this.env + '/user/unfollow?userId=' + id, getRequestOptions()).toPromise();
  }

  setUserId(id: number): void {
      this.userId = id;
  }

  getUserId(): number {
      return this.userId;
  }
}
