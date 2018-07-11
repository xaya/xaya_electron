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
	 
	 public namespaces; 
 
	constructor(private translate: TranslateService,private globalService:GlobalService) 
	{

     this.namespaces= [
					{value: 'p/', viewValue: 'p/ '+this.translate.instant('SCHIMAERA.RESERVE')},
					{value: 'g/', viewValue: 'g/ '+this.translate.instant('SCHIMAERA.RESERVE2')},
					{value: 'custom', viewValue: this.translate.instant('SCHIMAERA.RESERVE3')}
				    ];	 	  
		
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
	
    escapeHtml(text) {
		  return text
		  .replace(/&/g, "&amp;")
		  .replace(/</g, "&lt;")
		  .replace(/>/g, "&gt;")
		  .replace(/"/g, "&quot;")
		  .replace(/'/g, "&#039;");
    }
	
	async submitTheName()
	{

	    if(this.namespace == "" && this.nnamespacestom == "")
		{
			
			 swal("Error", this.translate.instant('SCHIMAERA.NONAMEERR'), "error")
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
		     swal("Error", this.sResult, "error");
			 return false;			
		}
		else
		{
			swal("Success", '<pre style = "color: #ffffff;">' + this.translate.instant('SCHIMAERA.SUCCESS1') + this.escapeHtml(tname) + this.translate.instant('SCHIMAERA.SUCCESS2') + '</pre>', "success");
			return true;	
		}
		
		
	}
		
    ngOnInit()
	{ 
	

    }
	
	
    ngOnDestroy()
	{

	}		
	
}
