import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import 'rxjs/add/operator/filter';
import { PagesnavbarComponent } from '../../shared/pagesnavbar/pagesnavbar.component';

declare var $: any;

@Component({
    selector: 'app-layout',
    templateUrl: './auth-layout.component.html'
})

export class AuthLayoutComponent {
    location: Location;
    private _router: Subscription;
    // url: string;

    @ViewChild(PagesnavbarComponent) pagesnavbar: PagesnavbarComponent;
    constructor( private router: Router, location:Location ) {
      this.location = location;
    }

    ngOnInit() {
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
        //   this.url = event.url;
          this.pagesnavbar.sidebarClose();
        });
    }
}
