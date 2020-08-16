import { Title } from '@angular/platform-browser';
import { environment } from './../environments/environment';
import { BnNgIdleService } from 'bn-ng-idle';
import { TokenStorageService } from './_services/token-storage.service';
import { user } from './_models/user';
import { AuthenticationService } from './_services/authentication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  title = 'Home';
  currentUser: user;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private bnIdle: BnNgIdleService,
    private titleService: Title
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.bnIdle.startWatching(environment.timeout).subscribe((res) => {
      if (res) {
        localStorage.removeItem('currentUser');
        console.log("session expired");
      }
    })
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}