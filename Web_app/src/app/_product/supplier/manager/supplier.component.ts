import { NotificationService } from './../../../_shared/notification.service';
import { ApiService } from './../../../_shared/api.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { InputSearch } from './../../../_models/InputSearch';
import { SupplierModel } from './../supplier-model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ResultApi } from './../../../_models/ResultAPI';
import { CreateComponent } from './../create/create.component';
import { SupplierService } from './../supplier.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  public rfSearchSupplier: FormGroup;
  public result: ResultApi;
  public input: InputSearch;
  // array of all items to be paged
  collection = { count: 60, data: Array<SupplierModel>() };
  check: boolean = false;
  stt: number;
  config = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: this.collection.count
  };

  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
    previousLabel: '<--',
    nextLabel: '-->',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };
  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private dialog: MatDialog,
    private service: ApiService,
    private notificationService: NotificationService,
  ) {

  }
  onPageChange(event) {
    this.config.currentPage = event;
    this.getListSupplier(this.input);
  }
  async getListSupplier(input: InputSearch) {
    this.collection.data = new Array<SupplierModel>();
    input.position = this.config.currentPage * 10 - 10;
    input.pageSize = this.config.itemsPerPage;
    this.stt = input.position + 1;
    await this.supplierService.getAllSupplier(input).subscribe(
      (res) => {
        this.result = res;
        this.config.totalItems = this.result.total;
        var list = JSON.parse(JSON.stringify(this.result.listItems));
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          this.collection.data.push(element);
        }
        this.check = true;
      });
  }
  onEdit(row) {
    this.service.GetByKey(row.supplierId, "/Supplier/getByKey").subscribe(
      (res) => {
        this.supplierService.populateForm(res);
      }
    );
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CreateComponent, dialogConfig).afterClosed().subscribe(res => {
      this.getListSupplier(this.input);
    });

  }
  delete(supplier) {
    if (window.confirm(`Bạn muốn xóa nhà cung cấp" ${supplier.name}" không?`)) {
      this.supplierService.Delete(supplier).then(response => {
        console.log("Thành công");
        this.input = new InputSearch();
        this.getListSupplier(this.input);
        this.notificationService.showSuccess("Xóa nhà cung cấp thành công")
      }).catch(error => {
        console.log(error);
        this.notificationService.showError("Error", "Xóa nhà cung cấp thất bại")
      })
    } else {
      console.log("Không xóa nhà cung cấp");
    }

  }
  search(value) {
    console.log(value);
    this.input.name = value.name;
    this.input.code = value.code;
    this.input.fromDate = value.fromDate;
    this.input.toDate = value.toDate;
    this.getListSupplier(this.input);
  }
  ngOnInit() {
    this.rfSearchSupplier = this.fb.group({
      name: new FormControl(),
      code: new FormControl(),
      fromDate: new Date(),
      toDate: new Date().setDate((new Date()).getDate() - 30),
    });
    this.input = new InputSearch();
    this.getListSupplier(this.input);
  }
  openCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CreateComponent, dialogConfig).afterClosed().subscribe(res =>
      this.getListSupplier(this.input)
    );
  }
}
