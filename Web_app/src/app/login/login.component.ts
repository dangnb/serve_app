import { AlertService } from "./../_services/alert.service";
import { AuthenticationService } from "./../_services/authentication.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  providers: [],
})
export class LoginComponent implements OnInit {
  rfContact: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }
  ngOnInit() {
    this.rfContact = this.fb.group({
      username: new FormControl(),
      password: new FormControl(),
    });
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  addPost(loginModel) {
    this.submitted = true;
    this.loading = true;
    // stop here if form is invalid
    if (this.rfContact.invalid) {
      return;
    }
    this.authenticationService.login(loginModel.username, loginModel.password).pipe(first()).subscribe(data => {
      console.log(data);
      this.loading = false;
      this.router.navigate([this.returnUrl]);
    },
      error => {
        this.loading = false;
      });
  }
}
