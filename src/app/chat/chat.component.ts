import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { GlobalService } from '../service/global.service';
import {TranslateService} from '@ngx-translate/core';


declare var $:any;
declare var swal:any;


declare interface ChatTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
  selector: 'chat-cmp',
  templateUrl: './chat.component.html'
})


export class ChatComponent implements OnInit {

     public chatNameTableData;

     private walletChangeSubscription: ISubscription;
	 private timeChangeSubscription: ISubscription;
	 
	 private sResult:string = "";
 
     public application:string = "chat.xaya.io";
     public namespace:string = "";
	 public namespaces; 
	 private updateGuard:boolean = false; 
	 
	 public chatStatus:string = "";
 
	constructor(private translate: TranslateService,private globalService:GlobalService) 
	{	  
     this.namespaces= [];	 		
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
	    let tname = this.namespace;
		
		if(tname == "")
		{
			
		}
		else
		{
			this.sResult =  await this.globalService.AddNewChatName(tname);
			
			if(this.sResult.indexOf("code") > 0 || this.sResult.indexOf("not valid") > 0 || this.sResult.indexOf("error") > 0 )
			{
				 swal("Error", this.sResult, "error");
				 return false;			
			}
			else
			{
				swal("Success", '<pre style = "color: #ffffff;">' + this.translate.instant('CHAT.SUCCESS1') + this.escapeHtml(tname) + this.translate.instant('CHAT.SUCCESS2') + '</pre>', "success");
				return true;	
			}
		}
		
	}
		
    async fillChatNames()
	{
		let _that = this;
		
		/* Needs this to prevent table filling 2 times due tu simultanious change event updates, seems like angular bug(?)*/
		if(this.updateGuard)
		{
			return;
		}
		
		this.updateGuard = true;
		
		setTimeout(function() 
		{
					
			_that.updateGuard = false;
			
		}, 1000);	
		
        let addressArray = await this.globalService.getChatNameList(this.namespaces);
		this.chatNameTableData = [];
		for(let d = 0; d < addressArray.length;d++)
		{
			
			let nameCandidate = addressArray[d][0];
			let newEntry = {"name": nameCandidate, "signers" : addressArray[d][1]};
		    this.chatNameTableData.push(newEntry);					
		}			
	}		
			
	async fillNames()
	{
        let addressArray = await this.globalService.getNameList();
		this.namespaces= [];	
		
		for(let d = 0; d < addressArray.length;d++)
		{
			this.namespaces.push({value: addressArray[d][0], viewValue: addressArray[d][0]});
		}		
		
		this.fillChatNames();
		
	}		
	
	async WaitForSynch()
	{
         this.chatStatus = await this.globalService.GetChatStatus();	

         if(this.chatStatus != this.translate.instant('CHAT.RUNNING'))
		 {
			 let _that = this;
			
			 setTimeout(function() 
			 {	
			  _that.WaitForSynch();
			 }, 1000);				 
		 }	
         else
	     {
			 this.fillNames();
			
			 this.walletChangeSubscription = this.globalService.walletChanged$.subscribe
			 (
				value => 
				{
				  this.fillNames();
			 });
				
			 this.timeChangeSubscription = this.globalService.tMedianTimeChanged$.subscribe
			 (
				 value => 
				 {
				 this.fillNames();
			 });				 
		 }			 
	}
	
	GetFullName(nameCandidate)
	{
		if(nameCandidate.toLowerCase() == nameCandidate && String(nameCandidate).match("^[A-z0-9]+$"))
		{
		}
		else
		{
			nameCandidate = "(x-" + (new Buffer(nameCandidate).toString('hex')) + ")";
		}	
		
		swal(nameCandidate, nameCandidate, "success");	
	}	
	
	async GeneratePassword(name)
	{
		await this.globalService.AuthWithWallet(name, this.application);
	}
		
    ngOnInit()
	{ 
         this.WaitForSynch();		 
    }
	
	
    ngOnDestroy()
	{
		
	 if(this.walletChangeSubscription != null && this.walletChangeSubscription != undefined)
	 {
		this.walletChangeSubscription.unsubscribe();
		this.timeChangeSubscription.unsubscribe();
	 }
	}		
	
}
