import { NotificationService } from './../../../_shared/notification.service';
import { MatDialogRef } from '@angular/material';
import { AlertService } from './../../../_services/alert.service';
import { SupplierService } from '../supplier.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  constructor(
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateComponent>,
  ) { }

  ngOnInit() {
  }
  onClose() {
    this.supplierService.form.reset();
    this.supplierService.initializeFormGroup();
    this.dialogRef.close();
  }
  addPost(value) {
    this.supplierService.Create(value).then(response => {
      if (response.err != null) {
        this.notificationService.showError(response.err.errorCode, response.err.description);
      } else {
        this.supplierService.form.reset();
        this.supplierService.initializeFormGroup();
        this.dialogRef.close();
        this.notificationService.showSuccess("Tạo nhà cung cấp thành công");
      }
    }).catch(error => {
      console.log(error);
      this.notificationService.showError('Error', 'Tạo nhà cung cấp thất bại');
    })
  }
}
