import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { GlobalService } from '../service/global.service';
import {TranslateService} from '@ngx-translate/core';

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
	 public selected:string = 'nmc';
	 public fee: boolean = false;
	 
	 private sResult:string = "";
	 
	 
	 public currencies = [
					{value: 'nmc', viewValue: 'CHI'},
					{value: 'mnmc', viewValue: 'mCHI'},
					{value: 'unmc', viewValue: 'uCHI'}
				    ];

	constructor(private translate: TranslateService, private globalService:GlobalService) 
	{


		
	}

	async makeThePayment()
	{
         var sendAmount = this.amount;
		 
	     if(this.selected == "mnmc")
		 {
			 sendAmount = sendAmount / 1000;
		 }
		 
	     if(this.selected == "unmc")
		 {
			 sendAmount = sendAmount / 1000000;
		 }		 
	
	    console.log("Send" + sendAmount + ":" + this.selected);
		this.sResult =  await this.globalService.sendPayment(this.address, sendAmount, this.label, this.fee);
		
		if(this.sResult == "Wrong address")
		{
		     swal("Error", this.translate.instant('SSEND.WRONGADDRESS'), "error");
			 return false;			
		}
		else
		{
			
			 this.address = "";
			 this.amount = 0;
			
		     swal("Done", this.sResult);
			 return false;				
		}
		
	}
	
}
