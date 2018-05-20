import { Routes } from '@angular/router';

import { ConsoleComponent } from './console.component';


export const ConsoleRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: ConsoleComponent
    }]
}];
