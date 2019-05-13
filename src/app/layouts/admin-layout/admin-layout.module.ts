import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AddressesComponent } from '../../addresses/addresses.component';
import { SendComponent } from '../../send/send.component';
import { TransactionsComponent } from '../../transactions/transactions.component';
import { NamecoinComponent } from '../../namecoin/namecoin.component';
import { NamecoinlistComponent } from '../../namecoinlist/namecoinlist.component';
import { ChatComponent } from '../../chat/chat.component';
import { SettingsComponent } from '../../settings/settings.component';
import { ConsoleComponent } from '../../console/console.component';

import {HttpClientModule, HttpClient} from '@angular/common/http';
import { PersistenceModule } from 'angular-persistence';
import {TranslateModule} from '@ngx-translate/core';



import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatSelectModule,
  MatTooltipModule,
  MatCheckboxModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatTooltipModule,
	MatSelectModule,
	MatCheckboxModule,
    HttpClientModule,
    PersistenceModule,
	TranslateModule,	
  ],
  declarations: [
    DashboardComponent,
    AddressesComponent,
    SendComponent,
    TransactionsComponent,
    NamecoinComponent,
	ChatComponent,
	NamecoinlistComponent,
    SettingsComponent,
    ConsoleComponent,
  ]
})

export class AdminLayoutModule {}
