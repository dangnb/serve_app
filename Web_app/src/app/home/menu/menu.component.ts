import { Component, OnInit } from '@angular/core';
import { user } from 'src/app/_models';
import { Router } from '@angular/router';
import { AuthenticationService, TokenStorageService } from 'src/app/_services';
import { ApiService } from 'src/app/_shared/api.service';
import { Menu } from './menu.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  userCurrent: user;
  listMenu: Array<Menu>;
  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private tokenStorageService: TokenStorageService,
    private apiService: ApiService) { }

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
