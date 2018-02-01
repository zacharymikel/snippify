import {Component, OnDestroy, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/Rx';
import {ContentService} from '../core/auth/content-service';
import {Observable} from 'rxjs/Observable';
import {HomeState} from '../core/shared/stores/home-store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { AudioService } from '../core/auth/audio-service';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public isSnippet = false;
  public state$: Observable<HomeState>;
  public currentPage = 1;
  public playerStatus$: Subscription;
  public playerStatus: string;
  public dataLoaded = false;
  scrollCallback;

  constructor(
    private store: Store<HomeState>,
    private contentService: ContentService,
    private audioService: AudioService,
    private titleService: Title,
  ) {
    this.state$ = this.store.select('homeStore');
    this.scrollCallback = this.onScrollDown.bind(this);
  }

  ngOnInit() {
    this.playerStatus$ = this.audioService.getPlayerStatus().subscribe((next) => {
      this.playerStatus = next;
    });
    this.contentService.getNewsFeed(this.currentPage++);
    this.titleService.setTitle('Home');
    this.dataLoaded = true;
  }

  ngOnDestroy() {
    this.playerStatus$.unsubscribe();
  }

  onScrollDown() {
    return this.contentService.getNextNewsFeedPage(this.currentPage).then(result => {
      if (result !== 0) {
        this.currentPage++;
      }
      return result;
    });
  }
}
