import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileRoutesModule } from './profile-routes.module';
import { MaterialModule } from '../vendor/angular-material-module';
import {CoreModule} from '../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutesModule,
    MaterialModule,
    CoreModule
  ],
  declarations: [
    ProfileComponent,
    SettingsComponent,
  ]
})
export class ProfileModule { }
