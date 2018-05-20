import { Routes } from '@angular/router';

import { NamecoinComponent } from './namecoin.component';


export const NamecoinRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: NamecoinComponent
    }]
}];
