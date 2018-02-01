import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './auth/auth-guard';
import { AuthService } from './auth/auth-service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreRoutesModule } from './core-routes.module';
import { UserService } from './auth/user-service';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from '../home/home.component';
import { ContentService } from './auth/content-service';
import { MaterialModule } from '../vendor/angular-material-module';
import { AudioService } from './auth/audio-service';
import { InfiniteScrollerDirective } from './shared/infinite-scroller-directive';
import {UploadSongComponent} from './upload-song/upload-song.component';
import {SongService} from './auth/song-service';
import {FeedItemComponent} from './feed-item/feed-item.component';
import { SearchComponent } from './search/search.component';
import { SearchItemComponent } from './search-item/search-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutesModule,
    MaterialModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
    NavComponent,
    HomeComponent,
    InfiniteScrollerDirective,
    UploadSongComponent,
    FeedItemComponent,
    SearchComponent,
    SearchItemComponent
  ],
  providers: [
    AuthGuard,
    AuthService,
    UserService,
    ContentService,
    AudioService,
    SongService
  ],
  exports: [
    NavComponent,
    HomeComponent,
    FeedItemComponent
  ]
})
export class CoreModule { }
