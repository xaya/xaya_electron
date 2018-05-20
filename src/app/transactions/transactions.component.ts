import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { PersistenceService } from 'angular-persistence';
import {TranslateService} from '@ngx-translate/core';
import { StorageType } from 'angular-persistence';
import { GlobalService } from '../service/global.service';
import { IPersistenceContainer } from 'angular-persistence';

declare var $:any;
declare var swal:any;

declare interface TransactionTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
  selector: 'transactions-cmp',
  templateUrl: './transactions.component.html'
})


export class TransactionsComponent  {


	 public dataTable: TransactionTable;
     private container: IPersistenceContainer;
 
	constructor(private translate: TranslateService, public persistenceService: PersistenceService, private globalService:GlobalService) 
	{

	    this.container = persistenceService.createContainer(
            'org.CHIMAERA.global',
            {type: StorageType.LOCAL, timeout: 220752000000}
        );
	
        translate.setDefaultLang('en');
 
		var lang =  this.container.get('lang');
		
		if(lang == undefined || lang == null)
		{
			lang = "en";
		}


		  translate.use(lang).subscribe(() => 
			{
			   this.initContinue();
		  }, err => 
		  {
				swal("Error", "Failed to init language", "error")
				return;
		  }, () => {
			
		  });		
		  
			  

		
	}
	
	
	reInitDataTable()
	{
		
	 var table = $('#datatables').DataTable({
		"pagingType": "full_numbers",
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		responsive: true,
		language: {
		search: "_INPUT_",
		searchPlaceholder: this.translate.instant('STRANSACTIONS.SEARCHTRANSACTIONS'),
		}

	});

		
	}	
	
	async initContinue()
	{
		var objArr = await this.globalService.getTransactions();
		
		this.dataTable =
		{
		headerRow: [ this.translate.instant('STRANSACTIONS.ADDRESS'), this.translate.instant('STRANSACTIONS.NAME'), this.translate.instant('STRANSACTIONS.CATEGORY'), this.translate.instant('STRANSACTIONS.AMOUNT')],
		footerRow: [ this.translate.instant('STRANSACTIONS.ADDRESS'), this.translate.instant('STRANSACTIONS.NAME'), this.translate.instant('STRANSACTIONS.CATEGORY'), this.translate.instant('STRANSACTIONS.AMOUNT')],
		dataRows:  objArr
		};		
		
        this.reInitDataTable();	     
	}	

	ngOnDestroy()
	{
	
	}


    ngOnInit()
	{ 
	
		this.dataTable =
		{
		headerRow: [ this.translate.instant('STRANSACTIONS.ADDRESS'), this.translate.instant('STRANSACTIONS.NAME'), this.translate.instant('STRANSACTIONS.CATEGORY'), this.translate.instant('STRANSACTIONS.AMOUNT')],
		footerRow: [ this.translate.instant('STRANSACTIONS.ADDRESS'), this.translate.instant('STRANSACTIONS.NAME'), this.translate.instant('STRANSACTIONS.CATEGORY'), this.translate.instant('STRANSACTIONS.AMOUNT')],
		dataRows:   []
		};		

	

    }
}
