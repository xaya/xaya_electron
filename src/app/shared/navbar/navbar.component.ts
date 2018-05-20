import { Component, OnInit, Renderer, ViewChild, ElementRef} from '@angular/core';
import { ROUTES } from '../.././sidebar/sidebar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { PersistenceService } from 'angular-persistence';
import { StorageType } from 'angular-persistence';
import { GlobalService}     from '../../service/global.service';
import { IPersistenceContainer } from 'angular-persistence';

var misc:any ={
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
}
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
	public precisionText: string;
	
   private container: IPersistenceContainer;

    @ViewChild("navbar-cmp") button;

    constructor(location:Location, private renderer : Renderer, private element : ElementRef, public persistenceService: PersistenceService, private globalService: GlobalService) 
	{
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
		
        this.container = persistenceService.createContainer(
            'org.CHIMAERA.global',
            {type: StorageType.LOCAL, timeout: 220752000000}
        );		
		
		var precision =  this.container.get('precision');
		
		if(precision == null || precision == undefined)
		{
			precision  =0;
		}
		
		this.setPrecision(precision);
    }
	
	setPrecision(precision)
	{
		if(precision == 0)
		{
			this.precisionText = " NMC";
			this.container.set('precision', 0);
		}
		if(precision == 1)
		{
			this.precisionText = " mNMC";	
            this.container.set('precision', 1);				
		}
		if(precision == 2)
		{
			this.precisionText = " μNMC";
			this.container.set('precision', 2);
		}		
	}
	
	setCoinPrecision(precision)
	{
		$('#coinNavBar').click();
		this.setPrecision(precision);	
		this.globalService.announceCurrencyChange("nexty");
		
	}
	
	
	setLangEN()
	{
		this.container.set('lang', 'en');
		
		$('#langsNavBar').click();
		 window.location.reload();
	}
	
	setLangRU()
	{
		this.container.set('lang', 'ru');
		
		$('#langsNavBar').click();
		 window.location.reload();
	}
	
    ngAfterViewInit()
    {
        var lang =  this.container.get('lang');
		
		if(lang == 'ru')
		{
			$('#langdrop').removeClass();
			$('#langdrop').addClass("flag-icon flag-icon-ru");
		}
		else
		{
			$('#langdrop').removeClass();
			$('#langdrop').addClass("flag-icon flag-icon-gb");
		}

    }		
	
    ngOnInit()
	{
        this.listTitles = ROUTES.filter(listTitle => listTitle);

        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        if($('body').hasClass('sidebar-mini')){
            misc.sidebar_mini_active = true;
        }
        $('#minimizeSidebar').click(function(){
            var $btn = $(this);

            if(misc.sidebar_mini_active == true){
                $('body').removeClass('sidebar-mini');
                misc.sidebar_mini_active = false;

            }else{
                setTimeout(function(){
                    $('body').addClass('sidebar-mini');

                    misc.sidebar_mini_active = true;
                },300);
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            var simulateWindowResize = setInterval(function(){
                window.dispatchEvent(new Event('resize'));
            },180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function(){
                clearInterval(simulateWindowResize);
            },1000);
        });
			
    }

    isMobileMenu(){
        if($(window).width() < 991){
            return false;
        }
        return true;
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
		if(this.toggleButton != undefined) // TODO: find out why it fails here with undefined
		{
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
		}
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

    getTitle(){
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if(titlee.charAt(0) === '#'){
            titlee = titlee.slice( 2 );
        }
        for(var item = 0; item < this.listTitles.length; item++){
            var parent = this.listTitles[item];
            if(parent.path === titlee){
                return parent.title;
            }else if(parent.children){
                var children_from_url = titlee.split("/")[2];
                for(var current = 0; current < parent.children.length; current++){
                    if(parent.children[current].path === children_from_url ){
                        return parent.children[current].title;
                    }
                }
            }
        }
        return 'Dashboard';
    }

    getPath(){
        // console.log(this.location);
        return this.location.prepareExternalUrl(this.location.path());
    }
}
