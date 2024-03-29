import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { PersistenceService } from 'angular-persistence';
import { StorageType } from 'angular-persistence';
import { GlobalService } from '../service/global.service';
import {TranslateService} from '@ngx-translate/core';

declare var $:any;
declare var swal:any;

@Component({
  selector: 'dashboard-cmp',
  templateUrl: './dashboard.component.html'
})




export class DashboardComponent {

    public tErrors: string;
	public tBalance: number;
	public tBlock: number;
	public tConnections: number;
	public tNetType: string;
	public tWalletVersion: number;
	public tBlockStatus: string;
	public encryptStatus: number  = -1;
	public textUnlocked: string = "";
	public cBlock: number;
	public cBlockMax: number;
	
	private subscription2: ISubscription;
	
	private lastNum: number;
	
	
    private tErrorsSs: ISubscription;
	private tBalanceSs: ISubscription;
	private tBlockSs: ISubscription;
	private tConnectionsSs: ISubscription;
	private tNetTypeSs: ISubscription;
	private tWalletVersionSs: ISubscription;
	private tBlockStatusSs: ISubscription;	
	private tBlockMaxSs: ISubscription;
	
	public tPruned: string;
	public tMedianTime: string;
	
	private tPrunedSs: ISubscription;
	private tMedianTimeSs: ISubscription;
	
	public precisionText: string;
	public barFillPercentage: string;
	public synchText: string;
	public tWalletBuildVersion: string;

	constructor(private translate: TranslateService, private globalService:GlobalService, private cdr: ChangeDetectorRef) 
	{
		this.barFillPercentage = "0%";
    	this.tErrors = "";
		this.tBalance = 0;
		this.tBlock = 0;
		this.tConnections = 0;
		this.tNetType = "";
		this.tWalletVersion = 0;
		this.tWalletBuildVersion =  window.require('electron').remote.app.getVersion();
		this.tBlockStatus = "";
		
        this.tPruned = "";
		this.tMedianTime = "";
		
        var precision =  this.globalService.container.get('precision');
		
		if(precision == null || precision == undefined)
		{
			precision = 0;
		}	

        if(precision == 0)
		{
			this.precisionText = " CHI";
		}
		if(precision == 1)
		{
			this.precisionText = " mCHI";				
		}
		if(precision == 2)
		{
			this.precisionText = " μCHI";
		}			

        this.synchText = this.translate.instant('SOVERVIEW.SYNCHRONIZING');		
		
	}
	
	async encryptWallet()
	{
		
		const {value: name} = await swal({
		  title: this.translate.instant('SOVERVIEW.ENTERPASSWORD'),
		  confirmButtonText: this.translate.instant('SOVERVIEW.ENCRYPTBTN'),
		  footer: '<div style = "color: #ffffff; font-size: 12px;">'+this.translate.instant('SOVERVIEW.FOOTERWARN')+'</div>',
		  input: 'password',
		  inputPlaceholder: '',
		  showCancelButton: true,
		  inputValidator: (value) => {
			return !value && swal(this.translate.instant('SOVERVIEW.PROVIDEPASS'), this.translate.instant('SOVERVIEW.PROVIDEPASS'), "error")
		  }
		})
		
		if(!name)
		{
			return;
		}
		
		const {value: name2} = await swal({
		  title: this.translate.instant('SOVERVIEW.REPEATPASSWORD'),
		  confirmButtonText: this.translate.instant('SOVERVIEW.ENCRYPTBTN'),
		  input: 'password',
		  inputPlaceholder: '',
		  showCancelButton: true,
		  inputValidator: (value) => {
			return !value && swal(this.translate.instant('SOVERVIEW.PROVIDEPASS'), this.translate.instant('SOVERVIEW.PROVIDEPASS'), "error")
		  }
		})		
		
		if(name != name2)
		{
			swal("Failed", this.translate.instant('SOVERVIEW.PASSNOMATCH'));  
			return;
		}

		
		if (name) 
		{
			
			
			swal({
			  title: this.translate.instant('SOVERVIEW.PROCESSING'),
			  text: this.translate.instant('SOVERVIEW.PWAIT'),
			  showConfirmButton: false,
			  allowOutsideClick: false
			});

		     return this.globalService.encryptWallet(name);
		}
		
		this.encryptStatus = this.globalService.getEncryptStatus();
		
		
	}
	
	isWalletVault()
	{
		if(this.globalService.walletType == "default")
		{
			return true;
		}
		
		return false;
	}
	
	async unlockWallet()
	{
		
		const {value: name} = await swal({
		  title: this.translate.instant('SOVERVIEW.ENTERPASSWORD'),
		  confirmButtonText: this.translate.instant('SOVERVIEW.UNLOCK'),
		  input: 'password',
		  inputPlaceholder: '',
		  showCancelButton: true,
		  inputValidator: (value) => {
			return !value && swal(this.translate.instant('SOVERVIEW.PROVIDEPASS'), this.translate.instant('SOVERVIEW.PROVIDEPASS'), "error")
		  }
		})

		if (name) 
		{
		     await this.globalService.unlockWallet(name);
		}
		
		this.encryptStatus = this.globalService.getEncryptStatus();
		this.cdr.detectChanges();

		
	}
	
	
	
	
	
	GetDecimalCount(num)
	{
        var precision =  this.globalService.container.get('precision');
		
		if(precision == null || precision == undefined)
		{
			precision  =0;
		}		
		
		if (typeof num === 'string') 
		{
			var realNum =  parseFloat(num);
			
			if(precision == 0)
			{
				return realNum.toFixed(8);
			}
			if(precision == 1)
			{
				return (realNum * 1000).toFixed(5);
			}
			if(precision == 2)
			{
				return (realNum * 1000000).toFixed(2);
			}			
		}
		else
		{
			if(precision == 0)
			{
				return num.toFixed(8);
			}
			if(precision == 1)
			{
				return (num * 1000).toFixed(5);
			}
			if(precision == 2)
			{
				return (num * 1000000).toFixed(2);
			}
		}
		
	}
	
	updateBalance(num)
	{
		this.lastNum = num;
		this.tBalance = this.GetDecimalCount(num);
		this.cdr.detectChanges();
	}
	
	
	checkBlockProgression()
	{
		
		if(this.cBlockMax == 0)
		{
			this.cBlockMax = 0;
		}
		
		 this.tBlock = this.cBlock;
		 this.tBlockStatus = this.cBlock + "/" + this.cBlockMax;
		 let barFillPercentageT = (this.cBlock / this.cBlockMax) * 100;
		 
		 //Just some sanity text for good visual output
		 if(barFillPercentageT < 0)
		 {
			 barFillPercentageT = 0;
		 }
		 
		 if(barFillPercentageT > 100)
		 {
			 barFillPercentageT = 100;
		 }
		 
		 if(barFillPercentageT != 100)
		 {
			 this.synchText = this.translate.instant('SOVERVIEW.SYNCHRONIZING');	
		 }
		 else
		 {
			 this.synchText = "";	
		 }
		 
		 this.barFillPercentage = barFillPercentageT+ "%";
		 this.cdr.detectChanges();
	}
	
	
	currenctChangedEventFired()
	{
		
        var precision =  this.globalService.container.get('precision');
		
		if(precision == null || precision == undefined)
		{
			precision  =0;
		}	

        if(precision == 0)
		{
			this.precisionText = " CHI";
		}
		if(precision == 1)
		{
			this.precisionText = " mCHI";				
		}
		if(precision == 2)
		{
			this.precisionText = " μCHI";
		}						
		
		this.updateBalance(this.lastNum);
		this.cdr.detectChanges();
	}


	
	ngOnDestroy()
	{
	 this.subscription2.unsubscribe();
	 
     this.tErrorsSs.unsubscribe();
	 this.tBalanceSs.unsubscribe();
	 this.tBlockSs.unsubscribe();
	 this.tConnectionsSs.unsubscribe();
	 this.tNetTypeSs.unsubscribe();
	 this.tWalletVersionSs.unsubscribe();
	 this.tBlockStatusSs.unsubscribe();	 
	 this.tBlockMaxSs.unsubscribe();

	 this.tPrunedSs.unsubscribe();	
	 this.tMedianTimeSs.unsubscribe();	
	 

	 
	}
	
    ngOnInit()
	{ 
     
     this.tPrunedSs = this.globalService.tPrunedChanged$.subscribe
	 (
        value => {
        this.tPruned = value + "";
     });	
	

     this.tMedianTimeSs = this.globalService.tMedianTimeChanged$.subscribe
	 (
        value => {
        this.tMedianTime = value + "";
     });		 
	   
	   
     this.tErrorsSs = this.globalService.tErrorsChanged$.subscribe
	 (
        value => {
        this.tErrors = " " + value;
     });	

     this.tBalanceSs = this.globalService.tBalanceChanged$.subscribe
	 (
        value => {
		this.updateBalance(value);
     });
	

     this.tBlockSs = this.globalService.tBlockChanged$.subscribe
	 (
        value => {
        this.cBlock = value;
		this.checkBlockProgression();
		
     });	

	 
     this.tConnectionsSs = this.globalService.tConnectionsChanged$.subscribe
	 (
        value => {
        this.tConnections = value;
     });	
	 
     this.tNetTypeSs = this.globalService.tNetTypeChanged$.subscribe
	 (
        value => {
        this.tNetType = value + "";
     });	 

     this.tWalletVersionSs = this.globalService.tWalletVersionChanged$.subscribe
	 (
        value => {
        this.tWalletVersion = value;
	    this.encryptStatus = this.globalService.getEncryptStatus();
		this.textUnlocked = this.globalService.getUnlockedText();
	    this.cdr.detectChanges();
		
		
     });	

     this.tBlockStatusSs = this.globalService.tBlockStatusChanged$.subscribe
	 (
        value => {
        this.tBlockStatus = value;
     });	

     this.tBlockMaxSs = this.globalService.tBlockMaxChanged$.subscribe
	 (
        value => {
        this.cBlockMax = value;
		this.checkBlockProgression();
     });		 
	   
	   
     this.subscription2 = this.globalService.curerencyChanged$.subscribe
	 (
        value => {
        this.currenctChangedEventFired();
     });	
	   
	   
	 this.globalService.getOverviewIfConnected();
	  
    }
}
