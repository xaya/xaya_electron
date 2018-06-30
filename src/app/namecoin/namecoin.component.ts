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
  selector: 'namecoin-cmp',
  templateUrl: './namecoin.component.html'
})


export class NamecoinComponent implements OnInit {


     public nname: string = "";
	 public nvalue: string = "";
     public nameAddressTableData;

	 private sResult:string = "";
	 private walletChangeSubscription: ISubscription;
	 
	 public namespace:string = "";
	 public nnamespacestom:string = "";
	 
	 public namespaces = [
					{value: 'p/', viewValue: 'p/ Reserve your account name'},
					{value: 'c/', viewValue: 'c/ Reserve a currency name'},
					{value: 'g/', viewValue: 'g/ Reserve a game name'},
					{value: 'custom', viewValue: 'custom'}
				    ];	 
 
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
	
	async updateNameBox(name)
	{

	    let _that = this;
		swal({
		  title: 'Update Name',
		  html:
			'<input id="swal-input1" class="swal2-input" placeholder = "Enter Value">' +
			'<input id="swal-input2" class="swal2-input" placeholder = "Enter Destination Address">',
		  focusConfirm: false,
		  showCancelButton: true,
		  preConfirm: function () {
			return new Promise(function (resolve) {
			  resolve([
				$('#swal-input1').val(),
				$('#swal-input2').val()
			  ])
			})
		  }
		}).then(function (result) 
		{
		  if(result.value[0] == "" && result.value[1] == "")
		  {
			  swal("Response", "No values were entered");  
			  return;
		  }
		  
		  _that.globalService.updateName(name, result.value[0], result.value[1]); 
		  
		  
		}).catch(swal.noop)		
		
		
	}
	
	customDisabled()
	{
		if(this.namespace == "custom")
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	
	async submitTheName()
	{

	    if(this.namespace == "" && this.nnamespacestom == "")
		{
			
			 swal("Error", "Please, select the namespace", "error")
			 return false;	
		}
	
	    if(this.nnamespacestom != "" && this.namespace == "custom")
		{
			this.namespace = this.nnamespacestom;
		}
	
	    let tname = this.namespace+ ""+ this.nname;
	
		this.sResult =  await this.globalService.AddNewName(tname, this.nvalue);
		
		this.nname = "";
		this.nvalue = "";
		this.nnamespacestom = "";
		
		if(this.sResult.indexOf("code") > 0 || this.sResult.indexOf("not valid") > 0 || this.sResult.indexOf("error") > 0 )
		{
		     swal("Error", this.sResult, "error")
			 return false;			
		}
		else
		{
			swal("Success", "Name '" + tname + "' is pending and will appear soon", "success")
		}
		
        this.nameAddressTableData = [];
	    this.fillNames();
		
	
		
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
