import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { PermissionComponent } from './manage/permission.component';
import { AuthGuard } from 'src/app/hepers';
import { MaterialModule } from 'src/app/material/material.module';
import { MatCommonModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';

const routers: Routes = [

    {
        path: '', component: PermissionComponent, canActivate: [AuthGuard]
    }
]
@NgModule({
    declarations: [PermissionComponent, CreateComponent],
    imports: [
        CommonModule,
        MaterialModule,
        MatCommonModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        RouterModule.forChild(routers)
    ],
    exports: [RouterModule],
    entryComponents: [CreateComponent,]
})
export class PermissionModule { }