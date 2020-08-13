import { SupplierComponent } from './manager/supplier.component';
import { SupplierService } from './supplier.service';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/material/material.module';
const router: Routes = [
  { path: '', component: SupplierComponent }
]


@NgModule({
  declarations: [SupplierComponent, CreateComponent,],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MaterialModule,
    RouterModule.forChild(router)
  ], providers: [SupplierService],
  entryComponents: [CreateComponent,]
})
export class SupplierModule { }
