import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserState} from './core/shared/stores/user-store';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {AudioService} from './core/auth/audio-service';


@Component({
  selector: 'app-home',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'WatYouGot';
  public playerStatus$: Subscription;
  public playerStatus: string;
  constructor(
    private store: Store<UserState>,
    private audioService: AudioService

) {

  }

  ngOnInit() {
    this.playerStatus$ = this.audioService.getPlayerStatus().subscribe((next) => {
      this.playerStatus = next;
    });
  }

  ngOnDestroy() {
    this.playerStatus$.unsubscribe();
  }

}
