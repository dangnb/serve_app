import { NotificationService } from './../../../_shared/notification.service';
import { CategoryproductModel } from './../CategoryProduct-model';
import { CreateComponent } from './../create/create.component';
import { CategoryProductService } from '../category.product.service';
import { ResultApi } from './../../../_models/ResultAPI';
import { InputSearch } from './../../../_models/InputSearch';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material'
import { createComponent } from '@angular/compiler/src/core';
import { ApiService } from 'src/app/_shared/api.service';

@Component({
  selector: 'app-category-product',
  templateUrl: './category-product.component.html',
  styleUrls: ['./category-product.component.css']
})
export class CategoryProductComponent implements OnInit {
  public rfSearch: FormGroup;
  public input: InputSearch;
  stt: number;
  check: boolean = false;
  public result: ResultApi;
  collection = { count: 60, data: Array<CategoryproductModel>() };
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
    private categoryProductService: CategoryProductService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private service: ApiService,
    private noise: NotificationService
  ) { }

  ngOnInit() {
    this.rfSearch = this.fb.group({
      name: new FormControl(),
      code: new FormControl(),
      fromDate: new Date(),
      toDate: new Date().setDate((new Date()).getDate() - 30),
    });
    this.input = new InputSearch();
    this.getListSupplier(this.input);
  }
  async getListSupplier(input: InputSearch) {
    this.collection.data = new Array<CategoryproductModel>();

    input.position = this.config.currentPage * 10 - 10;
    input.pageSize = this.config.itemsPerPage;
    this.stt = input.position + 1;
    await this.categoryProductService.getAllList(input).subscribe(
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
  search(value) {
    console.log(value);
    this.input.name = value.name;
    this.input.code = value.code;
    this.input.fromDate = value.fromDate;
    this.input.toDate = value.toDate;
    this.getListSupplier(this.input);
  }
  onPageChange(event) {
    this.config.currentPage = event;
    this.getListSupplier(this.input);
  }
  delete(value) {
    debugger;
    this.service.Delete(value, "/CategoryProduct/delete").then(response => {
      this.getListSupplier(this.input);
      this.noise.showSuccess("Xóa danh mục sản phẩm thành công");
    }).catch(error => {
      console.log(error);
    })
  }
  openCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CreateComponent, dialogConfig).afterClosed().subscribe(res => {
      this.getListSupplier(this.input);
    });
  }
  onEdit(categoryProduct) {
    this.service.GetByKey(categoryProduct.id, "/CategoryProduct/getById").subscribe(res => {
      this.categoryProductService.populateForm(categoryProduct);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "60%";
      this.dialog.open(CreateComponent, dialogConfig).afterClosed().subscribe(res => {
        this.getListSupplier(this.input);
      });
    });
  }
}
