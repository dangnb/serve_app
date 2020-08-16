import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from 'src/app/hepers';

const routes: Routes = [
    {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule), canActivate: [AuthGuard]
    },
    {
        path: 'permission',
        loadChildren: () => import('./permission/permission.module').then(m => m.PermissionModule), canActivate: [AuthGuard]
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HeThongRoutingModule { }