import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ResultApi } from 'src/app/_models/ResultAPI';
import { InputSearch } from 'src/app/_models/InputSearch';
import { RoleModel } from '../role.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AccountService } from '../../account/account.service';
import { NotificationService } from 'src/app/_shared/notification.service';
import { ApiService } from 'src/app/_shared/api.service';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {
  stt: number;
  check: boolean = false;
  public result: ResultApi;
  collection = { count: 60, data: Array<RoleModel>() };
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
    private accountService: AccountService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.rfSearch = this.fb.group({
      name: new FormControl(),
      code: new FormControl(),
      fromDate: new Date(),
      toDate: new Date().setDate((new Date()).getDate() - 30),
    });
    this.input = new InputSearch();
    this.getListRole(this.input);
  }
  async getListRole(input: InputSearch) {
    this.collection.data = new Array<RoleModel>();
    debugger;
    input.position = this.config.currentPage * 10 - 10;
    input.pageSize = this.config.itemsPerPage;
    this.stt = input.position + 1;
    await this.service.getAllList(input, "/role/getRoles").subscribe(
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
    this.getListRole(this.input);
  }
  onPageChange(event) {
    this.config.currentPage = event;
    this.getListRole(this.input);
  }
  openCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CreateComponent, dialogConfig).afterClosed().subscribe(res =>
      this.getListRole(this.input)
    );
  }
}
