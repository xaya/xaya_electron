import { Routes } from '@angular/router';

import { SendComponent } from './send.component';


export const SendRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: SendComponent
    }]
}];
