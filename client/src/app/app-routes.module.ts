import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './core/auth/auth-guard';
import { RedirectComponent } from './redirect/redirect.component';

const appRoutes: Routes = [
  { path: '', canActivate: [ AuthGuard ], component: HomeComponent},
  { path: '**', redirectTo: 'error'},
  { path: 'error', component: RedirectComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutesModule { }
