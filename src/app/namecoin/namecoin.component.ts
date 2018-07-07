import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { GlobalService } from '../service/global.service';
import {TranslateService} from '@ngx-translate/core';


declare var $:any;
declare var swal:any;


@Component({
  selector: 'namecoin-cmp',
  templateUrl: './namecoin.component.html'
})


export class NamecoinComponent implements OnInit {


     public nname: string = "";
	 public nvalue: string = "";
	 private sResult:string = "";

	 
	 public namespace:string = "";
	 public nnamespacestom:string = "";
	 
	 public namespaces = [
					{value: 'p/', viewValue: 'p/ Reserve your account name'},
					{value: 'g/', viewValue: 'g/ Reserve a game name'},
					{value: 'custom', viewValue: 'custom'}
				    ];	 
 
	constructor(private translate: TranslateService,private globalService:GlobalService) 
	{

	  
		
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
		
		
	}
		
    ngOnInit()
	{ 
	

    }
	
	
    ngOnDestroy()
	{

	}		
	
}
