import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionComponent } from './permission/permission.component';
import { AuthGuard } from 'src/app/hepers';
const routes: Routes = [
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule), canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [PermissionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class HeThongModule { }
