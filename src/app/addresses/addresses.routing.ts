import { Routes } from '@angular/router';

import { AddressesComponent } from './addresses.component';


export const AddressesRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: AddressesComponent
    }]
}];
