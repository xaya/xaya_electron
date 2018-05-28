import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { GlobalService } from '../service/global.service';
import {TranslateService} from '@ngx-translate/core';

declare var $:any;
declare var swal:any;


@Component({
  selector: 'addresses-cmp',
  templateUrl: './addresses.component.html'
})


export class AddressesComponent implements OnInit {

     public receiveAddressTableData;
	 public sendAddressTableData;
	 public aLabel: string = "";

 
	constructor(private translate: TranslateService, private globalService:GlobalService) 
	{

	}

	
    async insertReceivingAddress()
	{
		if(this.aLabel.length < 2)
		{
			swal("Error", this.translate.instant('SADDRESSES.PLEASEFILLTHELABLE'), "error")
			return;
		}		
		
		var value = await this.globalService.getNewAddress(this.aLabel);
		
	    if(value.length < 2 || value == undefined)
		{
			swal("Error", this.translate.instant('SADDRESSES.ADDRESSNOTVALID'), "error")
			return;		
		}
		else
		{
			this.aLabel = "";
	        this.receiveAddressTableData = [];
		    this.sendAddressTableData = [];
			this.fillReceivingAddresses();
		}			
			
	}		
	
    async fillReceivingAddresses()
	{
		let addressArray = await this.globalService.listLabels();
		
		for(let d = 0; d < addressArray.length;d++)
		{
			
			let addressArrayByLabel = await this.globalService.getAddressesByLabel(addressArray[d]);
			
			for (var key in addressArrayByLabel) 
			{
				
				if(addressArrayByLabel[key].purpose == "receive")
				{
					let newEntry = {"label": addressArray[d], "value" : key};
					this.receiveAddressTableData.push(newEntry);
				}
				else
				{
					let newEntry = {"label": addressArray[d], "value" : key};
					this.sendAddressTableData.push(newEntry);					
				}
			}
		}
		 
	}	
	
    ngOnInit()
	{ 
	
	    this.receiveAddressTableData = [];
		this.sendAddressTableData = [];
	    this.fillReceivingAddresses();

    }
}
