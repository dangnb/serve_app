import { Menu } from './menu.model';
import { TokenStorageService } from './../_services/token-storage.service';
import { user } from './../_models/user';
import { AuthenticationService } from './../_services/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_shared/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userCurrent: user;
  listMenu: Array<Menu>;
  listMenuChid: Array<Menu>;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private tokenStorageService: TokenStorageService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.tokenStorageService.currentUser.subscribe(data => {
      this.userCurrent = data;
    });
    this.apiService.getmenu("/menu/getmenu").subscribe(data => {
      this.listMenu = data.listItems;
      console.log(this.listMenu);
    })
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  ngAfterViewInit() {
    this.tokenStorageService.currentUser.subscribe(data => {
      this.userCurrent = data;
    });
  }

}
