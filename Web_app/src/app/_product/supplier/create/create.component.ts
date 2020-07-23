import { AlertService } from './../../../_services/alert.service';
import { SupplierService } from '../supplier.service';
import { AuthenticationService } from './../../../_services/authentication.service';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public rfCreateSupplier: FormGroup;
  constructor(private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private supplierService: SupplierService
    , private _location: Location,
    private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.clear();
    this.rfCreateSupplier = this.fb.group({
      name: new FormControl(),
      address: new FormControl(),
      code: new FormControl(),
      createdDate: new Date(),
      createdBy: this.authenticationService.currentUserValue.userName,
      status: true,
    });
  }
  addPost(value) {
    this.supplierService.Create(value).then(response => {
      //this._location.back();
      if (response.err.Depcription != null) {
        console.log("Thất bại");
        this.alertService.error(response.err.Depcription);
      } else {
        console.log("Thành công");
        this.alertService.success("Tạo nhà cung cấp thành công");
      }
    }).catch(error => {
      console.log(error);
      this.alertService.error(error);
    })
  }


}
