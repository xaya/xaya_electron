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
 
	constructor(private translate: TranslateService,private globalService:GlobalService, private cdr: ChangeDetectorRef) 
	{
		
	}
	
	
	 timeConverter(UNIX_timestamp){
	  var a = new Date(UNIX_timestamp * 1000);
	  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = a.getHours();
	  var min = a.getMinutes();
	  var sec = a.getSeconds();
	  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
	  return time;
	}
	

	async initContinue()
	{
		let transactionArray = await this.globalService.getTransactions();
		
		
		for(let d = 0; d < transactionArray.length;d++)
		{
	
			var formattedTime =this.timeConverter(transactionArray[d].time);
			
			let newEntry = {"time" : formattedTime, "address": transactionArray[d].address, "name" : transactionArray[d].label, "category" : transactionArray[d].category, "amount" : transactionArray[d].amount };
			this.transactionsTable.push(newEntry);
		}    
		
		this.cdr.detectChanges();
	}	

    ngOnInit()
	{ 
	
	   this.transactionsTable = [];
	   this.initContinue();  

    }
}
