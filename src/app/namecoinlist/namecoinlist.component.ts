import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { GlobalService } from '../service/global.service';
import {TranslateService} from '@ngx-translate/core';


declare var $:any;
declare var swal:any;

declare interface NamecoinTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
  selector: 'namecoinlist-cmp',
  templateUrl: './namecoinlist.component.html'
})


export class NamecoinlistComponent implements OnInit {



     public nameAddressTableData;
	 private sResult:string = "";
	 private walletChangeSubscription: ISubscription;
	 

	constructor(private translate: TranslateService,private globalService:GlobalService) 
	{

	  
		
	}
	
	
	async fillNames()
	{
        let addressArray = await this.globalService.getNameList();
		
		for(let d = 0; d < addressArray.length;d++)
		{
			
			let newEntry = {"name": addressArray[d][0], "value" : addressArray[d][1], address: addressArray[d][2]};
		    this.nameAddressTableData.push(newEntry);					
	
		}		
	}
	
	async transferNameBox(name)
	{

	    let _that = this;
		swal({
		  title: 'Transfer Name',
		  html: '<input id="swal-input1" class="swal2-input" placeholder = "Enter Destination Address">',
		  focusConfirm: false,
		  showCancelButton: true,
		  preConfirm: function () {
			return new Promise(function (resolve) {
			  resolve([
				$('#swal-input1').val()
			  ])
			})
		  }
		}).then(function (result) 
		{
		  if(result.value[0] == "")
		  {
			  swal("Response", "No values were entered");  
			  return;
		  }
		  
		  return _that.globalService.updateName(name, "", result.value[0]); 
		  
		  
		}).catch(swal.noop)		
		
		
	}	
	
	async updateNameBox(name)
	{

	    let _that = this;
		swal({
		  title: 'Update Name',
		  html: '<input id="swal-input1" class="swal2-input" placeholder = "Enter Value">',
		  focusConfirm: false,
		  showCancelButton: true,
		  preConfirm: function () {
			return new Promise(function (resolve) {
			  resolve([
				$('#swal-input1').val()
			  ])
			})
		  }
		}).then(function (result) 
		{
		  if(result.value[0] == "")
		  {
			  swal("Response", "No values were entered");  
			  return;
		  }
		  
		  return _that.globalService.updateName(name, result.value[0], ""); 
		  
		  
		}).catch(swal.noop)		
		
		
	}
	
    ngOnInit()
	{ 
	
        this.nameAddressTableData = [];
		
		 this.walletChangeSubscription = this.globalService.walletChanged$.subscribe
		 (
			value => {
              this.nameAddressTableData = [];
	          this.fillNames();
		 });
	   		
		

    }
	
	
    ngOnDestroy()
	{
	 this.walletChangeSubscription.unsubscribe();
	}		
	
}
