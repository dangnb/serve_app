import { NotificationService } from './../../../_shared/notification.service';
import { CategoryProductService } from './../category.product.service';
import { AlertService } from './../../../_services/alert.service';
import { AuthenticationService } from './../../../_services/authentication.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public rfCreate: FormGroup;
  constructor(private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private categoryProductService: CategoryProductService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateComponent>) { }

  ngOnInit() {
    this.alertService.clear();
  }
  onClose() {
    this.categoryProductService.form.reset();
    this.categoryProductService.initializeFormGroup();
    this.dialogRef.close();
  }
}
