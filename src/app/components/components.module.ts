import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import {HttpClientModule, HttpClient} from '@angular/common/http';
import { PersistenceModule } from 'angular-persistence';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [ RouterModule, CommonModule,
		HttpClientModule,
		PersistenceModule,
		TranslateModule],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class ComponentsModule { }
