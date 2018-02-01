import { MatChipInputEvent } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { SongService } from './../auth/song-service';
import { SafeStyle, SafeUrl } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Song} from '../../models/song';
import {Observable} from 'rxjs/Observable';
import { AudioService } from '../auth/audio-service';
import { Http } from '@angular/http';
import {Subscription} from 'rxjs/Subscription';
import {UserService} from '../auth/user-service';
import {Router} from '@angular/router';
import { ContentService } from '../auth/content-service';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.css']
})
export class FeedItemComponent implements OnInit, OnDestroy {

  @Input() song: Song;
  @Input() snippet: boolean;
  @Input() canDelete: boolean;
  public loaded: boolean;
  public currentTime: number;
  public currentTime$: Subscription;
  public playerStatus: string;
  public playerStatus$: Subscription;
  public currentTrack: string;
  public currentTrack$: Subscription;
  public images: String[] = [];
  public profilePicture: SafeStyle = '';
  public albumPicture: SafeUrl = '';
  public genreTags = [];
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;

  constructor(
    private audioService: AudioService,
    private userService: UserService,
    private router: Router,
    private contentService: ContentService,
    private songService: SongService,
    private sanitizer: DomSanitizer,
    private toasterService: ToasterService
  ) {
    this.loaded = false;
    this.snippet = true;
  }

  ngOnInit() {
    this.currentTime$ = this.audioService.getPercentElapsed().subscribe((next) => {
      this.currentTime = next;
    });
    this.playerStatus$ = this.audioService.getPlayerStatus().subscribe((next) => {
      this.playerStatus = next;
    });
    this.currentTrack$ = this.audioService.getCurrentTrack().subscribe((next) => {
      this.currentTrack = next;
    });

    this.contentService.getProfilePicture(this.song.artist.userId).then(res => {
      if (res.status === 200) {
        this.profilePicture =  this.sanitizer.bypassSecurityTrustStyle('url(\'data:image/*;base64,' + res._body + '\')');
      } else {
        this.profilePicture = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-profile.jpg)');
      }
    });

    this.contentService.getAlbumArt(this.song.id).then(res => {
      if (res.status === 200) {
        this.albumPicture = this.sanitizer.bypassSecurityTrustUrl('data:image/*;base64,' + res._body);
      } else {
        this.albumPicture = this.sanitizer.bypassSecurityTrustUrl('../../../assets/default_album_art/007-compact-disc.png');
      }
    });

    if (this.song.tags) {
      this.genreTags = JSON.parse(this.song.tags) || [];
    }
  }

  goToProfile() {
    this.userService.setUserId(this.song.artist.userId);
    this.router.navigate(['profile']);
  }

  ngOnDestroy() {
    this.currentTrack$.unsubscribe();
    this.playerStatus$.unsubscribe();
    this.currentTime$.unsubscribe();
  }

  toggle() {
    if (this.currentTrack === this.song.id) {
      this.audioService.toggleAudio();
    } else {
      this.audioService.loadAudio(this.song.id, this.snippet);
      this.audioService.playAudio();
    }
  }

  delete() {
    this.songService.deleteSong(this.song.id).then(res => {
      if (res.status === 200) {
        this.toasterService.pop('success', 'Success', 'Song deleted successfully.');
      } else {
        this.toasterService.pop('error', 'Error', 'Song could not be deleted at this time.');
      }
      return res;
    }, err => {
      console.log(err);
      return err;
    });
  }

  isMe(): boolean {
    return this.currentTrack === this.song.id;
  }

  // For Chiplists:
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our person
    if ((value || '').trim()) {
      this.genreTags.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  remove(fruit: any): void {
    const index = this.genreTags.indexOf(fruit);

    if (index >= 0) {
      this.genreTags.splice(index, 1);
    }
  }
}
