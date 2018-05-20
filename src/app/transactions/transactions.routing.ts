import { Routes } from '@angular/router';

import { TransactionsComponent } from './transactions.component';


export const TransactionsRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: TransactionsComponent
    }]
}];
