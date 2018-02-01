import { Title } from '@angular/platform-browser';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserState} from '../../core/shared/stores/user-store';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../../core/auth/user-service';
import {ToasterService} from 'angular2-toaster';
import {Settings} from '../../models/settings';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public state$: Observable<UserState>;
  public isEditMode = false;
  public settings: Settings;
  public stateSubscription: Subscription;

  constructor(
      private store: Store<UserState>,
      private userService: UserService,
      private toasterService: ToasterService,
      private router: Router,
      private titleService: Title
  ) {
    this.state$ = this.store.select('userStore');
  }

  ngOnInit() {
    this.stateSubscription = this.state$.subscribe((newState) => {
      this.settings = {...this.settings, ...newState.currentUser};
    });
    this.titleService.setTitle('Settings');
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
  }

  profilePictureFileChange(event): void {
    this.settings.profile = event.target.files[0];
  }

  bannerFileChange(event): void {
    this.settings.banner = event.target.files[0];
  }

  save(): void {
    this.isEditMode = false;
    this.userService.updateUser(this.settings).then((res) => {
      if (res.status === 200) {
        this.toasterService.pop('success', 'Success', 'User settings updated');
      } else {
        this.toasterService.pop('error', 'Error', res.json().errors[0]);
      }
    }, (err) => {
      this.toasterService.pop('error', 'Error', err.json().errors[0]);
    });
    this.router.navigate(['']);
  }
}
