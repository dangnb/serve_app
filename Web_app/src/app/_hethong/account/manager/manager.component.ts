import { AlertService } from './../../../_services/alert.service';
import { AccountModel } from './../account.model';
import { ResultApi } from './../../../_models/ResultAPI';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { InputSearch } from './../../../_models/InputSearch';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_shared/api.service';
import { CreateComponent } from '../create/create.component';
import { AccountService } from '../account.service';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  //khai bao bien
  stt: number;
  check: boolean = false;
  public result: ResultApi;
  collection = { count: 60, data: Array<AccountModel>() };
  config = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: this.collection.count
  };
  public rfSearch: FormGroup;
  public input: InputSearch;
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
    private dialog: MatDialog,
    private service: ApiService,
    private alertService: AlertService,
    private accountService: AccountService) { }

  ngOnInit() {
    this.rfSearch = this.fb.group({
      name: new FormControl(),
      code: new FormControl(),
      fromDate: new Date(),
      toDate: new Date().setDate((new Date()).getDate() - 30),
    });
    this.input = new InputSearch();
    this.getListAccount(this.input);
  }

  async getListAccount(input: InputSearch) {
    this.collection.data = new Array<AccountModel>();

    input.position = this.config.currentPage * 10 - 10;
    input.pageSize = this.config.itemsPerPage;
    this.stt = input.position + 1;
    await this.service.getAllList(input, "/account/getallaccount").subscribe(
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
    this.getListAccount(this.input);
  }
  onPageChange(event) {
    this.config.currentPage = event;
    this.getListAccount(this.input);
  }
  openCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CreateComponent, dialogConfig).afterClosed().subscribe(res =>
      this.getListAccount(this.input)
    );
  }
  delete(value) {
    debugger;
    this.service.Delete(value, "/account/delete").then(
      (res) => {
        this.alertService.success("Xóa tài khoản thành công");
        this.getListAccount(this.input);
        setTimeout(() => { this.alertService.clear(); }, 1250);
      }
    ).catch(error => {
      this.alertService.error("Xóa tài khoản thất bại");
    });
  }
  onEdit(row) {
    console.log(row);
    this.service.GetByKey(row.id, "/account/getByKey").subscribe(
      (res) => {
        console.log(res);
        this.accountService.populateForm(res);
      }
    );
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CreateComponent, dialogConfig);

  }
}
