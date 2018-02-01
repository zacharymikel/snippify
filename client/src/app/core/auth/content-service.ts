import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Http } from '@angular/http';
import {getApiEnvironment, getRequestOptions} from './http-utilities';
import { Store } from '@ngrx/store';
import {Song} from '../../models/song';
import {HomeState} from '../shared/stores/home-store';
import {NEWS_FEED_LOADED, UPDATE_NEWS_FEED} from '../shared/actions/home-actions';
import {PROFILE_LOADED, PROFILE_FEED_LOADED} from '../shared/actions/profile-actions';
import {ProfileState} from '../shared/stores/profile-store';
import {User} from '../../models/user';
import { SearchState } from '../shared/stores/search-store';
import { SEARCH_RESULTS_LOADED } from '../shared/actions/search-actions';

@Injectable()
export class ContentService {
  private env: string;

  constructor(
    private http: Http,
    private store: Store<HomeState>,
    private profileStore: Store<ProfileState>,
    private searchStore: Store<SearchState>
  ) {
    this.env = getApiEnvironment();
  }

  getNewsFeed(page: number): Promise<any> {
      const endpoint = this.env + '/news-feed?page=' + 1;
      return this.http.get(endpoint, getRequestOptions())
      .toPromise()
      .then(res => {
        const results = res.json().object as Song[];
        this.store.dispatch({type: NEWS_FEED_LOADED, payload: results});
        return res;
      }, (error) => {
        return error;
      });
  }

  getNextNewsFeedPage(page: number): Promise<any> {
    const endpoint = this.env + '/news-feed?page=' + page;
    return this.http.get(endpoint, getRequestOptions())
      .toPromise()
      .then(res => {
        const results = res.json().object as Song[];
        this.store.dispatch({type: UPDATE_NEWS_FEED, payload: results});
        return results.length;
      }, (error) => {
        return error;
      });
  }

  getUserProfileFeed(id: number, pageNumber: number): Promise<any> {
    const endpoint = this.env + '/profile/news-feed?userId=' + id + '&page=' + pageNumber + '&numItems=10';
    return this.http.get(endpoint, getRequestOptions())
      .toPromise()
      .then(res => {
        const results = res.json().object as Song[];
        this.store.dispatch({type: PROFILE_FEED_LOADED, payload: results});
        return res;
      }, error => {
        return error;
      });
  }

  getUserProfile(id: number): Promise<any> {
    return this.http.get(this.env + '/profile?userId=' + id, getRequestOptions())
      .toPromise()
      .then( res => {
        const user = res.json().object as User;
        this.profileStore.dispatch({type: PROFILE_LOADED, payload: user});
        return res;
      }, error => {
        return error;
      });
  }

  getProfilePicture(id: number): Promise<any> {
    return this.http.get(this.env + '/user/profile-picture?userId=' + id, getRequestOptions()).toPromise();
  }

  getBannerPicture(id: number): Promise<any> {
    return this.http.get(this.env + '/user/profile-banner?userId=' + id, getRequestOptions()).toPromise();
  }

  getAlbumArt(id: string): Promise<any> {
    return this.http.get(this.env + '/song/album-art?songId=' + id, getRequestOptions()).toPromise();
  }

  getSearchResults(query: string): Promise<any> {
    let endpoint = this.env + '/user/search';
    if(query) {
        endpoint += '?username=' + query;
    }

    return this.http.get(endpoint, getRequestOptions())
      .toPromise()
      .then( res => {
        const results = res.json().object as User[];
        this.searchStore.dispatch({type: SEARCH_RESULTS_LOADED, payload: results});
        return res;
      }, err => {
        return err;
      });
  }
}
