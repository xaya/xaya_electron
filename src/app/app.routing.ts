import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutingModule: Routes = [{
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },{
        path: '',
        component: AdminLayoutComponent,
        children: [{
            path: '',
            loadChildren: './dashboard/dashboard.module#DashboardModule'
        },{
            path: 'settings',
            loadChildren: './settings/settings.module#SettingsModule'
        },{
            path: 'addresses',
            loadChildren: './addresses/addresses.module#AddressesModule'
        },{
            path: 'send',
            loadChildren: './send/send.module#SendModule'
        },{
            path: 'transactions',
            loadChildren: './transactions/transactions.module#TransactionsModule'
        },{
            path: 'console',
            loadChildren: './console/console.module#ConsoleModule'
        },{
            path: 'namecoin',
            loadChildren: './namecoin/namecoin.module#NamecoinModule'
        }]
        },{
            path: '',
            component: AuthLayoutComponent,
            children: [{
                path: 'pages',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            }]
        }
];
