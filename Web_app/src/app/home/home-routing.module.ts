import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from './home.component';
import { AuthGuard } from '../hepers';

const routes: Routes = [
    {
        path: '', component: HomeComponent, children: [

            {
                path: 'product',
                loadChildren: () => import('./_product/product.module').then(m => m.ProductModule)
                , canActivate: [AuthGuard],
            },
            {
                path: 'hethong',
                loadChildren: () => import('./_hethong/hethong.module').then(m => m.HeThongModule)
                , canActivate: [AuthGuard],
            },
        ]
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }