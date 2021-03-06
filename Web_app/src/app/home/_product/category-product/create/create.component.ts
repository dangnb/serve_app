import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ApiService } from 'src/app/_shared/api.service';
import { AuthenticationService } from 'src/app/_services';
import { CategoryProductService } from '../category.product.service';
import { NotificationService } from 'src/app/_shared/notification.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public rfCreate: FormGroup;
  constructor(
    private service: ApiService,
    private authenticationService: AuthenticationService,
    private categoryProductService: CategoryProductService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateComponent>) { }

  ngOnInit() {
  }
  onClose() {
    this.categoryProductService.form.reset();
    this.categoryProductService.initializeFormGroup();
    this.dialogRef.close();
  }
  addPost(categoryProduct) {
    if (categoryProduct.id == 0 || categoryProduct.id == null || categoryProduct.id == "") {
      categoryProduct.createdDate = new Date;
      categoryProduct.status = true;
      categoryProduct.createdBy = this.authenticationService.currentUserValue.userName;
      this.service.CreateOrUpdate(categoryProduct, "/CategoryProduct/create").then((result) => {
        let item = JSON.parse(JSON.stringify(result));
        if (item.err == null) {
          this.notificationService.showSuccess("Tạo mới tài khoản thành công");
          this.categoryProductService.form.reset();
          this.categoryProductService.initializeFormGroup();
          this.dialogRef.close();
        } else {
          let error = JSON.parse(JSON.stringify(item.err));
          console.log(item.err);
          this.notificationService.showError(error.errorCode, error.description);
        }
      }).catch(error => {
        console.log();
      });
    } else {
      this.service.CreateOrUpdate(categoryProduct, "/CategoryProduct/update").then((result) => {
        let item = JSON.parse(JSON.stringify(result));
        if (item.err == null) {
          this.notificationService.showSuccess("Cập nhật tài khoản thành công");
          this.categoryProductService.form.reset();
          this.categoryProductService.initializeFormGroup();
          this.dialogRef.close();
        } else {
          this.notificationService.showError(item.err.errorCode, item.err.description);
        }
      }).catch(error => {
        console.log();
      });
    }
  }
}
