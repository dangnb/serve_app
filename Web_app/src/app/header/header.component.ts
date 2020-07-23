import { TokenStorageService } from './../_services/token-storage.service';
import { user } from './../_models/user';
import { AuthenticationService } from './../_services/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userCurrent: user;
  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.tokenStorageService.currentUser.subscribe(data => {
      this.userCurrent = data;
      console.log("full name: " + this.userCurrent.fullName);
    });
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  ngAfterViewInit() {
  }

}
