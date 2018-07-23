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
     public amount: number; 
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
	
	
	async paymentProceed(sendAmount, sendAddress)
	{
		this.sResult =  await this.globalService.sendPayment(sendAddress, sendAmount, this.label, this.fee);
		
		if(this.sResult == "Wrong address")
		{
			 swal("Error", this.translate.instant('SSEND.WRONGADDRESS'), "error");
			 return false;			
		}
		else
		{
			
			 this.address = "";
			 this.amount = null;
			
			 swal("Done", this.sResult);
			 return false;				
		}		
	}

	async makeThePayment()
	{
         var sendAmount = this.amount;
		 var sendAddress = this.address;
		 
		 let _that = this;
	     if(this.selected == "mnmc")
		 {
			 sendAmount = sendAmount / 1000;
		 }
		 
	     if(this.selected == "unmc")
		 {
			 sendAmount = sendAmount / 1000000;
		 }		 
	
	
        swal({
		  title: this.translate.instant('SSEND.CONFIRM2') + sendAmount + ' CHI?',
		  confirmButtonText: this.translate.instant('SSEND.CONFIRM'),
		  footer: '<div style = "color: #ffffff; font-size: 12px;">'+this.translate.instant('SSEND.CONFIRM1') +'</div>',
		  type: 'info',
		  showCancelButton: true,
		}).then((result) => 
		{
			if(result.value)
			{
               _that.paymentProceed(sendAmount, sendAddress);
			}
        })	     
	

		
	}
	
}
