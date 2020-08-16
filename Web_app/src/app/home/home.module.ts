import { HomeRouting } from './home.routing.module';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { HomeRoutingModule } from './home-routing.module';
import { FootersComponent } from './footers/footers.component';

@NgModule({
    declarations: [
        HomeComponent,
        MenuComponent,
        FootersComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule
    ]
})
export class HomeModule { }