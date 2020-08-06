import { ResultApi } from './../../_models/ResultAPI';
import { InputSearch } from './../../_models/InputSearch';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RoleModel } from './role.model';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {
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
  constructor() { }

  ngOnInit() {
  }

}
