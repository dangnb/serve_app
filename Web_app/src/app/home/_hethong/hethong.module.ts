import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'src/app/hepers';
import { PermissionComponent } from './permission/manage/permission.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeThongRoutingModule } from './hethong.routing.module';
@NgModule({
  declarations: [],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    HeThongRoutingModule
  ]
})
export class HeThongModule { }
