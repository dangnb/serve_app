import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './hepers';
import { NotFoundComponent } from './not-found/not-found.component';


const routes: Routes = [
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
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
