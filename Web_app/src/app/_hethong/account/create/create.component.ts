import { Router } from '@angular/router';
import { AuthenticationService } from './../../../_services/authentication.service';
import { MatDialogRef } from '@angular/material';
import { NotificationService } from './../../../_shared/notification.service';
import { AlertService } from './../../../_services/alert.service';
import { AccountService } from './../account.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_shared/api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(private accountService: AccountService,
    private alertService: AlertService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateComponent>,
    private service: ApiService,
    private authen: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  onClose() {
    this.alertService.clear();
    this.accountService.form.reset();
    this.accountService.initializeFormGroup();
    this.dialogRef.close();
  }
  createAccount(value) {
    debugger;
    if (value.id > 0 || value.id == null) {
      value.createdDate = new Date;
      value.status = true;
      value.createdBy = this.authen.currentUserValue.userName;
      this.service.CreateOrUpdate(value, "/account/create").then((result) => {
        let item = JSON.parse(JSON.stringify(result));
        if (item.err == null) {
          this.notificationService.success("Tạo tài khoản thành công");
          this.accountService.form.reset();
          this.accountService.initializeFormGroup();
          this.dialogRef.close();
        } else {
          this.notificationService.warn(item.err.description);
        }
      }).catch(error => {
        console.log();
        this.alertService.error(error);
      });
    } else {
      this.service.CreateOrUpdate(value, "/account/update").then((result) => {
        let item = JSON.parse(JSON.stringify(result));
        if (item.err == null) {
          this.notificationService.success("Cập nhât thành công");
          this.accountService.form.reset();
          this.accountService.initializeFormGroup();
          this.dialogRef.close();
        } else {
          this.notificationService.warn(item.err.description);
        }
      }).catch(error => {
        console.log();
        this.alertService.error(error);
      });
    }
  }
}
