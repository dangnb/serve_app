import { AuthGuard } from './../hepers/auth.guard';
import { Router, Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule), canActivate: [AuthGuard]
  },
  {
    path: 'category-product',
    loadChildren: () => import('./category-product/category-product.module').then(m => m.CategoryProductModule), canActivate: [AuthGuard]
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductModule { }
