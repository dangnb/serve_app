import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_shared/api.service';
import { MenuModel } from './menu.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  listMenu: Array<MenuModel>;
  form: FormGroup;
  websiteList: any = [
    { id: 1, name: 'ItSolutionStuff.com' },
    { id: 2, name: 'HDTuto.com' },
    { id: 3, name: 'NiceSnippets.com' }
  ];
  constructor(
    private service: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      website: this.formBuilder.array([], [Validators.required]),
      name: new FormControl(),
      title: new FormControl(),
    })
  }

  onCheckboxChange(e) {
    const website: FormArray = this.form.get('website') as FormArray;

    if (e.target.checked) {
      website.push(new FormControl(e.target.value));
    } else {
      const index = website.controls.findIndex(x => x.value === e.target.value);
      website.removeAt(index);
    }
  }

  ngOnInit() {
    this.getList();
    console.log(this.listMenu);
  }

  async getList() {
    this.listMenu = new Array<MenuModel>();
    await this.service.getAllListAll("/menu/getall").subscribe(
      (res) => {
        var list = JSON.parse(JSON.stringify(res.listItems));
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          this.listMenu.push(element);
        }
      });
  }
  submit() {
    console.log(this.form.value);
  }

}
