import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from '../auth/auth-service';
import { Observable } from 'rxjs/Observable';
import { UserState } from '../shared/stores/user-store';
import { Store } from '@ngrx/store';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {User} from '../../models/user';
import {UserService} from '../auth/user-service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

  public state$: Observable<UserState>;
  public sub: Subscription;
  public user: User;
  public hoveredOverProfile: Boolean;
  public hoveredOverSettings: Boolean;
  public hoveredOverNav: Boolean;
  public hoveredOverHome: Boolean;
  public hoveredOverSearch: Boolean;
  public hoveredOverUploadSong: Boolean;
  public hoveredOverLogOut: Boolean;
  public hoveredOverLogIn: Boolean;
  public hoveredOverRegister: Boolean;

  constructor(
    private authService: AuthService,
    private store: Store<UserState>,
    private userService: UserService,
    private router: Router
  ) {
    this.state$ = this.store.select('userStore');
  }

  ngOnInit() {
    this.hoveredOverHome = false;
    this.hoveredOverNav = false;
    this.hoveredOverLogIn = false;
    this.hoveredOverRegister = false;

    this.hoveredOverSearch = false;
    this.hoveredOverUploadSong = false;
    this.hoveredOverSettings = false;
    this.hoveredOverProfile = false;
    this.hoveredOverLogOut = false;

    this.sub = this.state$.subscribe((next) => {
      this.user = next.currentUser;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goToProfile(): void {
    this.userService.setUserId(this.user._id);
    this.router.navigate(['profile']);
  }
  hoverIn(item): void {
    if (item === 'nav') {
      this.hoveredOverNav = true;
    } else if (item === 'profile') {
      this.hoveredOverProfile = true;
    } else if (item === 'settings') {
      this.hoveredOverSettings = true;
    } else if (item === 'home') {
      this.hoveredOverHome = true;
    } else if (item === 'search') {
      this.hoveredOverSearch = true;
    } else if (item === 'uploadSong') {
      this.hoveredOverUploadSong = true;
    } else if (item === 'logOut') {
      this.hoveredOverLogOut = true;
    } else if (item === 'logIn') {
      this.hoveredOverLogIn = true;
    } else if (item === 'register') {
      this.hoveredOverRegister = true;
    }
  }
  hoverOut(item): void {
    if (item === 'nav') {
      this.hoveredOverNav = false;
    } else if (item === 'profile') {
      this.hoveredOverProfile = false;
    } else if (item === 'settings') {
      this.hoveredOverSettings = false;
    } else if (item === 'home') {
      this.hoveredOverHome = false;
    } else if (item === 'search') {
      this.hoveredOverSearch = false;
    } else if (item === 'uploadSong') {
      this.hoveredOverUploadSong = false;
    } else if (item === 'logOut') {
      this.hoveredOverLogOut = false;
    } else if (item === 'logIn') {
      this.hoveredOverLogIn = false;
    } else if (item === 'register') {
      this.hoveredOverRegister = false;
    }
  }
  isHover(item): Boolean {
    if (item === 'nav') {
      return this.hoveredOverNav;

    } else if (item === 'home') {
      return this.hoveredOverHome;

    } else if (item === 'settings') {
      return this.hoveredOverSettings;

    } else if (item === 'profile') {
      return this.hoveredOverProfile;

    } else if (item === 'uploadSong') {
      return this.hoveredOverUploadSong;

    } else if (item === 'search') {
      return this.hoveredOverSearch;

    } else if (item === 'logOut') {
      return this.hoveredOverLogOut;

    } else if (item === 'logIn') {
      return this.hoveredOverLogIn;

    } else if (item === 'register') {
      return this.hoveredOverRegister;
    }
  }
  logout(): void {
    this.authService.logout();
  }

}
