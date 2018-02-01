import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/auth-guard';
import { ProfileComponent } from './profile.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: 'settings', canActivate: [AuthGuard], component: SettingsComponent },
  { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProfileRoutesModule { }
