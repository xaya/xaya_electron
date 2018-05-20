import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { PersistenceService } from 'angular-persistence';
import { StorageType } from 'angular-persistence';
import { IPersistenceContainer } from 'angular-persistence';

declare global {
  interface Window {
    require: any;
  }
}

const electron = window.require("electron");

declare const $: any;



//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    // icon: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
    {
        path: '/dashboard',
        title: 'LEFTMENU.OVERVIEW',
        type: 'link',
        icontype: 'pe-7s-graph'
    },
    {
        path: '/addresses',
        title: 'LEFTMENU.ADDRESSES',
        type: 'link',
        icontype: 'pe-7s-notebook'
    },
    {
        path: '/send',
        title: 'LEFTMENU.SEND',
        type: 'link',
        icontype: 'pe-7s-cash'
    },	
    {
        path: '/transactions',
        title: 'LEFTMENU.TRANSACTIONS',
        type: 'link',
        icontype: 'pe-7s-display1'
    },
    {
        path: '/namecoin',
        title: 'LEFTMENU.NAMECOIN',
        type: 'link',
        icontype: 'cc NMC'
    },
    {
        path: '/settings',
        title: 'LEFTMENU.SETTINGS',
        type: 'link',
        icontype: 'pe-7s-settings'
    },	
    {
        path: '/console',
        title: 'LEFTMENU.CONSOLE',
        type: 'link',
        icontype: 'pe-7s-airplay'
    },		
    {
        path: '/exit',
        title: 'LEFTMENU.EXIT',
        type: 'script',
        icontype: 'pe-7s-close-circle'
    },	
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent {
    public menuItems: any[];
	private container: IPersistenceContainer;

    isNotMobileMenu(){
        if($(window).width() > 991){
            return false;
        }
        return true;
    }

	exitApp()
	{
		electron.remote.getCurrentWindow().close();
		console.log("Exiting");
	}
	
    ngOnInit()
	{

		this.menuItems = ROUTES.filter(menuItem => menuItem);	
            
    }
	
    ngAfterViewInit(){



    }
	
	isMobileMenu() {
		  if ($(window).width() > 991) {
			  return false;
		  }
		  return true;
	  };	
	
    constructor(translate: TranslateService, public persistenceService: PersistenceService)
	{

        translate.setDefaultLang('en');
		
        this.container = persistenceService.createContainer(
            'org.CHIMAERA.global',
            {type: StorageType.LOCAL, timeout: 220752000000}
        );		
 
		var lang = this.container.get('lang');
		
		if(lang == undefined || lang == null)
		{
			lang = "en";
		}
		
        translate.use(lang);
    }		
	
}
