import { CategoryProductComponent } from './manager/category-product.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { AuthGuard } from 'src/app/hepers';
import { MaterialModule } from 'src/app/material/material.module';
const routes: Routes = [
  { path: '', component: CategoryProductComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CategoryProductComponent, CreateComponent],
  exports: [CategoryProductComponent],
  entryComponents: [CreateComponent]
})
export class CategoryProductModule { }