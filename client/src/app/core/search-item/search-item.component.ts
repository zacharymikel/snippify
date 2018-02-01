import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../auth/user-service';
import { ContentService } from '../auth/content-service';
import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent implements OnInit {

  @Input() user: User;
  public profilePicture: SafeStyle;

  constructor(
    private userService: UserService,
    private router: Router,
    private contentService: ContentService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.contentService.getProfilePicture(this.user._id).then(res => {
      if (res.status === 200) {
        this.profilePicture =  this.sanitizer.bypassSecurityTrustStyle('url(data:image/*;base64,' + res._body + ')');
      } else {
        this.profilePicture = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-profile.jpg)');
      }
    });
  }

  goToProfile() {
    this.userService.setUserId(this.user._id);
    this.router.navigate(['profile']);
  }

}
