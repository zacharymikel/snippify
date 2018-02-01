import { ToasterService } from 'angular2-toaster';
import { ADD_FOLLOWING, REMOVE_FOLLOWING } from './../core/shared/actions/user-actions';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {ContentService} from '../core/auth/content-service';
import {UserService} from '../core/auth/user-service';
import {ProfileState} from '../core/shared/stores/profile-store';
import {Subscription} from 'rxjs/Subscription';
import {User} from '../models/user';
import {UserState} from '../core/shared/stores/user-store';
import {DomSanitizer, SafeStyle, SafeUrl, SafeValue} from '@angular/platform-browser';
import {sanitizeUrl} from '@angular/platform-browser/src/security/url_sanitizer';
import {Router} from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public state$: Observable<ProfileState>;
  public userState$: Observable<UserState>;
  public userId: number;
  public currentUser: User;
  public sub1: Subscription;
  public profilePicture: SafeUrl = '';
  public bannerPicture: SafeStyle = '';

  constructor(
    private store: Store<ProfileState>,
    private userStore: Store<UserState>,
    private contentService: ContentService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private toasterService: ToasterService,
    private titleService: Title
  ) {
    this.state$ = this.store.select('profileStore');
    this.userState$ = this.userStore.select('userStore');
  }

  ngOnInit() {
    this.userId = this.userService.getUserId();
    if (!this.userId) {
      this.router.navigate(['']);
      return;
    }
    this.contentService.getUserProfile(this.userId);
    this.contentService.getUserProfileFeed(this.userId, 1);
    this.sub1 = this.userState$.subscribe(next => {
      this.currentUser = next.currentUser;
    });
    this.contentService.getProfilePicture(this.userId).then(res => {
      if (res.status === 200) {
        this.profilePicture =  this.sanitizer.bypassSecurityTrustUrl('data:image/*;base64,' + res._body);
      } else {
        this.profilePicture = this.sanitizer.bypassSecurityTrustUrl('../../assets/default-profile.jpg');
      }
    });

    this.contentService.getBannerPicture(this.userId).then(res => {
      if (res.status === 200) {
        this.bannerPicture = this.sanitizer.bypassSecurityTrustStyle('url(data:image/*;base64,' + res._body + ')');
      } else {
        this.bannerPicture = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-banner.jpg)');
      }
    });

    this.titleService.setTitle('Profile');
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

  follow() {
    this.userService.followUser(this.userId).then(res => {
      if (res.status === 200) {
        this.userStore.dispatch({type: ADD_FOLLOWING, payload: this.userId});
        this.toasterService.pop('success', 'Success', 'Now following ' + this.userId);
      } else {
        this.toasterService.pop('error', 'Error', res.json().errors[0]);
      }
    });
  }

  unfollow() {
    this.userService.unfollowUser(this.userId).then(res => {
      if (res.status === 200) {
        this.userStore.dispatch({type: REMOVE_FOLLOWING, payload: this.userId});
        this.toasterService.pop('success', 'Success', 'You are now unfollowing ' + this.userId);
      } else {
        this.toasterService.pop('error', 'Error', res.json().errors[0]);
      }
    });
  }

  follows(): boolean {
    if (this.currentUser) {
      return this.currentUser.following.indexOf(this.userId.toString()) !== -1;
    }
  }

  canDelete(): boolean {
    if (this.currentUser) {
      return this.currentUser._id === this.userId;
    }
  }
}
