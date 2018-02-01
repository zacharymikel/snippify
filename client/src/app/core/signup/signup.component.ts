import { ToasterService } from 'angular2-toaster';
import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../auth/auth-service';
import { Registration } from '../..//models/registration';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {UserService} from '../auth/user-service';

@Component({
  selector: 'app-login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  public model: Registration;
  public registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private titleService: Title,
    private toastService: ToasterService
  ) {
    this.model = new Registration();
    this.registerForm = fb.group({
      fullname: new FormControl(this.model.name, Validators.required),
      username: new FormControl(this.model.username, Validators.required),
      email: new FormControl(this.model.email, Validators.required),
      password: new FormControl(this.model.password, Validators.required),
      confirmPassword: new FormControl(this.model.confirmPassword, Validators.required)
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Register');
  }

  isValid(): boolean {
    if (!this.password.value || !this.confirmPassword.value) {
      return false;
    }else {
      return this.password.value === this.confirmPassword.value;
    }
  }

  register(): any {
    // TODO: make this not as janky
    this.model.password = this.password.value;
    this.model.email = this.email.value;
    this.model.username = this.username.value;
    this.model.name = this.fullname.value;

    console.log(this.model);
    this.authService.register(this.model).then( res => {
      if (res.status === 200) {
        this.toastService.pop('success', 'Success', 'Registration successful!');
        this.userService.getUser();
        this.router.navigate(['']);
        return res;
      } else {
        this.toastService.pop('error', 'Error', res.json().errors[0]);
      }
    });
  }

  // Getters for form values.
  get fullname() { return this.registerForm.get('fullname'); }
  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get email() { return this.registerForm.get('email'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

}
