import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { PersistenceService } from 'angular-persistence';
import {TranslateService} from '@ngx-translate/core';
import { StorageType } from 'angular-persistence';
import { GlobalService } from '../service/global.service';
import { IPersistenceContainer } from 'angular-persistence';

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


export class NamecoinComponent  {


     public nname: string = "";
	 public nvalue: string = "";

	 public dataTable: NamecoinTable;
     private container: IPersistenceContainer;
	 
	 private sResult:string = "";
 
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
		searchPlaceholder: this.translate.instant('SCHIMAERA.SEARCHTRANSACTIONS'),
		}

	});

		
	}	
	
	async submitTheName()
	{

	
		this.sResult =  await this.globalService.AddNewName(this.nname, this.nvalue);
		
		this.nname = "";
		this.nvalue = "";
		
		await this.initContinue();
		
		
		if(this.sResult.indexOf("code") > 0)
		{
		     swal("Error", this.sResult, "error")
			 return false;			
		}
		
	}
		
	
	async initContinue()
	{
		var objArr = await this.globalService.getNameList();
		
		this.dataTable =
		{
		headerRow: [ this.translate.instant('SCHIMAERA.ACCOUNTNAME'), this.translate.instant('SCHIMAERA.VALUE'), this.translate.instant('SCHIMAERA.ADDRESS')],
		footerRow: [ this.translate.instant('SCHIMAERA.ACCOUNTNAME'), this.translate.instant('SCHIMAERA.VALUE'), this.translate.instant('SCHIMAERA.ADDRESS')],
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
		headerRow: [ this.translate.instant('SCHIMAERA.ACCOUNTNAME'), this.translate.instant('SCHIMAERA.VALUE'), this.translate.instant('SCHIMAERA.ADDRESS')],
		footerRow: [ this.translate.instant('SCHIMAERA.ACCOUNTNAME'), this.translate.instant('SCHIMAERA.VALUE'), this.translate.instant('SCHIMAERA.ADDRESS')],
		dataRows:   []
		};		

	

    }
}
