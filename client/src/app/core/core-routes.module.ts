import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import {UploadSongComponent} from './upload-song/upload-song.component';
import {AuthGuard} from './auth/auth-guard';
import { SearchComponent } from './search/search.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },
  { path: 'upload-song', canActivate: [AuthGuard], component: UploadSongComponent },
  { path: 'search', canActivate: [AuthGuard], component: SearchComponent }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CoreRoutesModule { }
