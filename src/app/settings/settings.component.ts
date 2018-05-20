import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { PersistenceService } from 'angular-persistence';
import {TranslateService} from '@ngx-translate/core';
import { StorageType } from 'angular-persistence';
import { GlobalService } from '../service/global.service';
import { IPersistenceContainer } from 'angular-persistence';


declare var $:any;
declare var swal:any;



@Component({
  selector: 'settings-cmp',
  templateUrl: './settings.component.html'
})


export class SettingsComponent {


    public host: string  = "";
	public username: string  = "";
	public passwordField: string  = "";
    public port: number  = 0;

	
	
	private container: IPersistenceContainer;
	
	constructor(translate: TranslateService, public persistenceService: PersistenceService, private globalService:GlobalService) 
	{

        this.container = persistenceService.createContainer(
            'org.CHIMAERA.global',
            {type: StorageType.LOCAL, timeout: 220752000000}
        );		
	
        translate.setDefaultLang('en');
 
		var lang =  this.container.get('lang');
		
		if(lang == undefined || lang == null)
		{
			lang = "en";
		}
		
        translate.use(lang);	
		
	

    this.host =  this.container.get('host');
		
	if( this.host == undefined ||  this.host == null)
	{
			 this.host = "127.0.0.1";
	}  
	
    this.port =  this.container.get('port');
		
	if(this.port == undefined || this.port == null)
	{
			this.port = 8336;
	}  	
  
    this.username = this.container.get('username');
    this.passwordField = this.container.get('password');		
		
		
	}

    updateSettingsDetails()
	{
		this.container.set('host', this.host);
		this.container.set('port', this.port);
		this.container.set('username', this.username);
		this.container.set('password', this.passwordField);
		this.globalService.reconnectTheClient();
		swal("Success", "Settings Saved", "success")
		
	}
	
	ngOnDestroy()
	{
	
	}
	
    ngOnInit()
	{ 
       

	  
    }
}
