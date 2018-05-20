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
  selector: 'send-cmp',
  templateUrl: './send.component.html'
})


export class SendComponent  {

     public address: string = "";
	 public label: string = "";
     public amount: number = 0; 
	 public currency: string = 'nmc';
	 public fee: boolean = false;
	 
	 private sResult:string = "";
	 
     private container: IPersistenceContainer;
 
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

	async makeThePayment()
	{
         var sendAmount = this.amount;
		 
	     if(this.currency == "mnmc")
		 {
			 sendAmount = sendAmount / 1000;
		 }
		 
	     if(this.currency == "unmc")
		 {
			 sendAmount = sendAmount / 1000000;
		 }		 
	
		this.sResult =  await this.globalService.sendPayment(this.address, sendAmount, this.label, this.fee);
		
		if(this.sResult == "Wrong address")
		{
		     swal("Error", this.translate.instant('SADDRESSES.WRONGADDRESS'), "error")
			 return false;			
		}
		
	}
	
	
	ngOnDestroy()
	{
	
	}


    ngOnInit()
	{ 
	


    }
}
