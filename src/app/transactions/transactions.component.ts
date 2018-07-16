import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { GlobalService } from '../service/global.service';
import {TranslateService} from '@ngx-translate/core';

declare var $:any;
declare var swal:any;

@Component({
  selector: 'transactions-cmp',
  templateUrl: './transactions.component.html'
})


export class TransactionsComponent implements OnInit  {


	public transactionsTable;
    private walletChangeSubscription: ISubscription;
	private timeChangeSubscription: ISubscription;
	public start:number =0;
	public showNext: boolean = false;
	private updateGuard:boolean = false; 
	 
	 
	constructor(private translate: TranslateService,private globalService:GlobalService, private cdr: ChangeDetectorRef) 
	{
	   this.transactionsTable = [];	
	   $("prevlink").hide();
	}
	
	
	 timeConverter(UNIX_timestamp){
	  var a = new Date(UNIX_timestamp * 1000);
	  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = a.getHours();
	  var min = a.getMinutes();
	  var sec = a.getSeconds();
	  
	  var sdate = "" + date;
	  
	  if(date < 10)
	  {
		  sdate = "0" + date;
	  }
	  
	  var time = year + '-' + month + '-' + sdate + ' ' + ('0' + hour).slice(-2) + ':' + ('0' + min).slice(-2) + ':' + ('0' + sec).slice(-2) ;
	  return time;
	}
	
	clickPrev()
	{
		this.start -= 10;
		this.showNext = false;
        this.transactionsTable = [];
		this.initContinue(); 			
	}
	
	clickNext()
	{
		this.start += 10;
		this.showNext = false;
        this.transactionsTable = [];
		this.initContinue(); 		
	}

	
	showTxID(txstring)
	{
		swal(txstring);
	}
	
	async initContinue()
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
	
		let transactionArray = await this.globalService.getTransactions(this.start);
		
		if(transactionArray.length < 10)
		{
			this.showNext = false;
		}
		else
		{
			this.showNext = true;
		}
		
		for(let d = transactionArray.length-1; d >= 0;d--)
		{
	
	        let tr = 0.000001;
			tr = transactionArray[d].amount;
			let trnm = transactionArray[d].label;
			
			if(transactionArray[d].category == "send")
			{
			  tr = transactionArray[d].amount + transactionArray[d].fee;
			  
			  if(transactionArray[d].name != undefined && transactionArray[d].comment != undefined)
			  {
			    trnm = transactionArray[d].name + transactionArray[d].comment;
			  }
			  else if(transactionArray[d].name != undefined)
			  {
				  trnm = transactionArray[d].name;
			  }
			  else
			  {
				 if(transactionArray[d].comment != undefined)
				 {
				   trnm = transactionArray[d].comment;
				 }
			  }
			}
			
			tr = Math.round(tr * 1000000000000) / 1000000000000;
			
			var formattedTime =this.timeConverter(transactionArray[d].time);
			let newEntry = {"time" : formattedTime, "address": transactionArray[d].address, "name" : trnm, "category" : transactionArray[d].category, "amount" : tr, "confirmations" : transactionArray[d].confirmations, "txid" : transactionArray[d].txid  };	
			this.transactionsTable.push(newEntry);

		}    
		
	    return "";
		
	}	

    ngOnInit()
	{ 
	

	   this.walletChangeSubscription = this.globalService.walletChanged$.subscribe
	   (
		value => {
			
		this.transactionsTable = [];
		this.initContinue(); 
	   });
	   
	   
	   this.timeChangeSubscription = this.globalService.tMedianTimeChanged$.subscribe
	   (
		value => {
		
		  this.transactionsTable = [];
		  this.initContinue(); 

	   });	   
	   

    }
	
	
    ngOnDestroy()
	{
	 this.walletChangeSubscription.unsubscribe();
	 this.timeChangeSubscription.unsubscribe();
	}		
	
}
