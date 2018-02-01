import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutesModule } from './app-routes.module';
import { HttpModule } from '@angular/http';
import { CoreModule } from './core/core.module';
import { ProfileModule } from './profile/profile.module';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { MaterialModule } from './vendor/angular-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { RedirectComponent } from './redirect/redirect.component';

import { userStoreReducer} from './core/shared/reducers/user-reducer';
import { profileStoreReducer } from './core/shared/reducers/profile-reducer';
import {homeStoreReducer} from './core/shared/reducers/home-reducer';
import { searchStoreReducer } from './core/shared/reducers/search-reducer';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    CoreModule,
    ProfileModule,
    ToasterModule,
    MaterialModule,
    FlexLayoutModule,
    StoreModule.provideStore({
      userStore: userStoreReducer,
      profileStore: profileStoreReducer,
      homeStore: homeStoreReducer,
      searchStore: searchStoreReducer
    }),
    AppRoutesModule,
  ],
  declarations: [
    AppComponent,
    RedirectComponent
  ],
  exports: [
    HttpModule,
  ],
  providers: [
    ToasterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
