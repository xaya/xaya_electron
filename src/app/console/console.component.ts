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
  selector: 'console-cmp',
  templateUrl: './console.component.html'
})


export class ConsoleComponent  {


    private container: IPersistenceContainer;
	public command:string = "";
	public consoleText:string = "";
 
	constructor(private translate: TranslateService, public persistenceService: PersistenceService, private globalService:GlobalService) 
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
		  
	}
	
	
	onKeydown(event) {
	  if (event.key === "Enter") {
		this.sendConsoleCommand();
	  }
	}
	
	async sendConsoleCommand()
	{
		var cmd = this.command;
		this.command = "";
		var result = await this.globalService.consoleCommand(cmd);
		
		
		this.consoleText += result;
		this.consoleText += "\n";
		
		
	}

	ngOnDestroy()
	{
	
	}


    ngOnInit()
	{ 
	

    }
}
