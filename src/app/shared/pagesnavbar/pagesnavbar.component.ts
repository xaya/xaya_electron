import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'pagesnavbar-cmp',
    templateUrl: 'pagesnavbar.component.html'
})

export class PagesnavbarComponent implements OnInit{
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;

    @ViewChild("pagesnavbar-cmp") button;

    constructor(location:Location, private renderer : Renderer, private element : ElementRef) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit(){
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        console.log(this.location.prepareExternalUrl(this.location.path()));
    }

    sidebarOpen(){
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        },500);
        body.classList.add('nav-open');
        this.sidebarVisible = true;
    }
    sidebarClose(){
        var body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    }
    sidebarToggle(){
        // var toggleButton = this.toggleButton;
        // var body = document.getElementsByTagName('body')[0];
        if(this.sidebarVisible == false){
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }

    isLogin(){
        if(this.location.prepareExternalUrl(this.location.path()) === 'pages/login'){
            return true;
        }
        return false;
    }

    isLock(){
        if(this.location.prepareExternalUrl(this.location.path()) === 'pages/lock'){
            return true;
        }
        return false;
    }

    isRegister(){
        if(this.location.prepareExternalUrl(this.location.path()) === 'pages/register'){
            return true;
        }
        return false;
    }
    
    getPath(){
        // console.log(this.location);
        return this.location.prepareExternalUrl(this.location.path());
    }
}
