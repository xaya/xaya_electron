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
	
	

	async initContinue()
	{
		let transactionArray = await this.globalService.getTransactions();
		
		
		for(let d = 0; d < transactionArray.length;d++)
		{
			let newEntry = {"address": transactionArray[d].address, "name" : transactionArray[d].label, "category" : transactionArray[d].category, "amount" : transactionArray[d].amount };
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
