import { SupplierModel } from './supplier-model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { InputSearch } from './../../_models/InputSearch';
import { ResultApi } from './../../_models/ResultAPI';
import { SupplierService } from './supplier.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  public rfSearchSupplier: FormGroup;
  public result: ResultApi;
  public input: InputSearch
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
  constructor(private fb: FormBuilder, private supplierService: SupplierService) {

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
  delete(value) {
    this.supplierService.Delete(value).then(response => {
      console.log("Thành công");
      let input: InputSearch = new InputSearch();
      this.getListSupplier(input);
    }).catch(error => {
      console.log(error);
    })
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
}
