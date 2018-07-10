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
	private skipFirstInit: boolean = true;
	public start:number =0;
	public showNext: boolean = false;
	
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
	  
	  var time = year + '-' + month + '-' + sdate + ' ' + hour + ':' + min + ':' + sec ;
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

	
	async initContinue()
	{

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
	
	        let tr = transactionArray[d].amount;
			
			if(transactionArray[d].label == "send")
			{
			  tr = transactionArray[d].amount + transactionArray[d].fee;
			}
			
			var formattedTime =this.timeConverter(transactionArray[d].time);
			let newEntry = {"time" : formattedTime, "address": transactionArray[d].address, "name" : transactionArray[d].label, "category" : transactionArray[d].category, "amount" : tr, "confirmations" : transactionArray[d].confirmations };	
			this.transactionsTable.push(newEntry);

		}    
		
         this.skipFirstInit = true;
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
		
		if(this.skipFirstInit == false)
		{
	
		  this.transactionsTable = [];
		  this.initContinue(); 
		}
	   });	   
	   

    }
	
	
    ngOnDestroy()
	{
	 this.walletChangeSubscription.unsubscribe();
	 this.timeChangeSubscription.unsubscribe();
	}		
	
}
