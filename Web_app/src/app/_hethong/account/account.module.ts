import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../material/material.module';
import { AuthGuard } from './../../hepers/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { ManagerComponent } from './manager/manager.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
const routes: Routes = [
  { path: '', component: ManagerComponent, canActivate: [AuthGuard] },
];


@NgModule({
  declarations: [
    CreateComponent,
    ManagerComponent,

  ],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  entryComponents: [CreateComponent,]
})
export class AccountModule { }
