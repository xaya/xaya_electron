import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';


export const SettingsRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: SettingsComponent
    }]
}];
