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
		this.updateGuard = false;
        this.transactionsTable = [];
		this.initContinue(); 
        this.cdr.detectChanges();
		
		setTimeout(function() 
		{	
		   const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
           const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
		   elemMainPanel.scrollTop = 0;
           elemSidebar.scrollTop = 0;

		}, 100);	
		
		
	}
	
	
	async SaveSCVToFile(filePath)
	{
			let transactionArray = await this.globalService.getAllTransactions();
			
			let lenV = transactionArray.length;
			

			let input = [];
			let dArraS = ["category", "amount","name","comment","address","txid"];
			input.push(dArraS);
			for(let d = lenV-1; d >= 0;d--)
			{
				let dArra = [transactionArray[d].category, transactionArray[d].amount,transactionArray[d].name,transactionArray[d].comment,transactionArray[d].address,transactionArray[d].txid];
				input.push(dArra);
			}	
			
			
			
			let _that = this;
			const stringify = window.require('csv-stringify')
			stringify(input, function(err, output)
			{
				
				const fs = window.require('fs');
				fs.writeFileSync(filePath,output);
				swal(_that.translate.instant('STRANSACTIONS.EDONE'), _that.translate.instant('STRANSACTIONS.EDONE'), "success");
				
			});		
	}
	
	async exportCSV()
	{
		let filePath;
		let _that = this;
		window.require('electron').remote.dialog.showSaveDialog({title: this.translate.instant('SSETTINGS.SELBUDIST'), defaultPath: '~/transactions.csv',  filters: [{name: 'Transactions Data', extensions: ['csv']}]}, (filePath) => 
		{
			if (filePath === undefined)
			{
				swal(this.translate.instant('SOVERVIEW.ERROR'), this.translate.instant('SSETTINGS.NOFILESEL'), "error");
				return;
			}	

      
		
		    _that.SaveSCVToFile(filePath);
		

		
		});	
		
		
	}
	
	clickNext()
	{
		this.start += 10;
		this.showNext = false;
		this.updateGuard = false;
        this.transactionsTable = [];
		this.initContinue(); 
        this.cdr.detectChanges();
		
		setTimeout(function() 
		{	
		   const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
           const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
		   elemMainPanel.scrollTop = 0;
           elemSidebar.scrollTop = 0;
		}, 100);
		
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
		this.transactionsTable = [];
		
		setTimeout(function() 
		{
					
			_that.updateGuard = false;
			
		}, 1000);		
	
		let transactionArray = await this.globalService.getTransactions(this.start);
		
		
		
		if(transactionArray.length < 11)
		{
			this.showNext = false;
		}
		else
		{
			this.showNext = true;
		}
		
		let lenV = transactionArray.length;
		
		
		let limitCheck = 1;
		
		if(lenV > 10)
		{
			lenV = 10;
		}
		else
		{
			lenV -= 1;
			limitCheck = 0;
		}

		
		for(let d = lenV; d >= limitCheck;d--)
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
			
	    this.start = 0;
		this.initContinue(); 
		this.cdr.detectChanges();		
	   });
	   
	   
	   this.timeChangeSubscription = this.globalService.tMedianTimeChanged$.subscribe
	   (
		value => {
		
		  this.initContinue(); 
		  this.cdr.detectChanges();		

	   });	   
    }
	
    ngOnDestroy()
	{
	 this.walletChangeSubscription.unsubscribe();
	 this.timeChangeSubscription.unsubscribe();
	}		
	
}
