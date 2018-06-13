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
	 
	 public namespace:string = "";
	 public nnamespacestom:string = "";
	 
	 public namespaces = [
					{value: 'p/', viewValue: 'p/'},
					{value: 'c/', viewValue: 'c/'},
					{value: 'g/', viewValue: 'g/'}
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
	
	async submitTheName()
	{

	    if(this.namespace == "" && this.nnamespacestom == "")
		{
			
			 swal("Error", "Please, select the namespace", "error")
			 return false;	
		}
	
	    if(this.nnamespacestom != "")
		{
			this.namespace = this.nnamespacestom;
		}
	
	    let tname = this.namespace+ ""+ this.nname;
	
		this.sResult =  await this.globalService.AddNewName(tname, this.nvalue);
		
		this.nname = "";
		this.nvalue = "";
		this.nnamespacestom = "";
		
		if(this.sResult.indexOf("code") > 0)
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
	    this.fillNames();

    }
}
