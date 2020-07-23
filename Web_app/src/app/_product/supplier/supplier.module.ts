import { SupplierService } from './supplier.service';
import { SupplierComponent } from './supplier.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
const router: Routes = [
  { path: '', component: SupplierComponent },
  { path: 'create', component: CreateComponent }
]


@NgModule({
  declarations: [SupplierComponent, CreateComponent,],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    RouterModule.forChild(router)
  ], providers: [SupplierService]
})
export class SupplierModule { }
