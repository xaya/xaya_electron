import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import { GlobalService}     from '../../service/global.service';
import {TranslateService} from '@ngx-translate/core';

declare var $: any;
declare var swal:any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
      mobile_menu_visible: any = 0;
    private sidebarVisible: boolean;
    public precisionText: string;
	

    constructor(private translate: TranslateService, location:Location, private element : ElementRef, private globalService: GlobalService, private router: Router) 
	{
        this.location = location;
        this.sidebarVisible = false;
	
		
		var precision =  this.globalService.container.get('precision');
		
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
			this.globalService.container.set('precision', 0);
		}
		if(precision == 1)
		{
			this.precisionText = " mNMC";	
            this.globalService.container.set('precision', 1);				
		}
		if(precision == 2)
		{
			this.precisionText = " μNMC";
			this.globalService.container.set('precision', 2);
		}		
	}
	
	setCoinPrecision(precision)
	{
		$('#coinNavBar').click();
		this.setPrecision(precision);	
		this.globalService.announceCurrencyChange("nexty");
		
	}
	
	minimizeMe()
	{
		window.require('electron').remote.getCurrentWindow().hide();
	}
	
	showHelp()
	{
		swal(this.translate.instant("NAVBAR.HELP"), this.translate.instant("NAVBAR.HELPTEXT"))
	}
	
	showAbout()
	{
		swal(this.translate.instant("NAVBAR.ABOUT"), this.translate.instant("NAVBAR.ABOUTEXT"))
	}
	
	
	setLangEN()
	{
		this.globalService.container.set('lang', 'en');
		
		$('#langsNavBar').click();
		 window.location.reload();
	}
	
	setLangRU()
	{
		this.globalService.container.set('lang', 'ru');
		
		$('#langsNavBar').click();
		 window.location.reload();
	}
	
    ngAfterViewInit()
    {
        var lang =  this.globalService.container.get('lang');
		
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

   ngOnInit(){
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.router.events.subscribe((event) => {
        this.sidebarClose();
         var $layer: any = document.getElementsByClassName('close-layer')[0];
         if ($layer) {
           $layer.remove();
           this.mobile_menu_visible = 0;
         }
     });
    }

    sidebarOpen() {

        const body = document.getElementsByTagName('body')[0];
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {

        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              body.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 2 );
      }
      titlee = titlee.split('/').pop();

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
}
