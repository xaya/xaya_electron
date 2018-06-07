import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { PersistenceService } from 'angular-persistence';
import { StorageType } from 'angular-persistence';
import { GlobalService } from '../service/global.service';

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
	
	public cBlock: number;
	public cBlockMax: number;
	
	
	private subscription2: ISubscription;
	private lastNum: any;
	
    private tErrorsSs: ISubscription;
	private tBalanceSs: ISubscription;
	private tBlockSs: ISubscription;
	private tConnectionsSs: ISubscription;
	private tNetTypeSs: ISubscription;
	private tWalletVersionSs: ISubscription;
	private tBlockStatusSs: ISubscription;	
	private tBlockMaxSs: ISubscription;
	
	public tPruned: string;
	public tDifficulty: string;
	public tMedianTime: string;
	
	private tPrunedSs: ISubscription;
	private tDifficultySs: ISubscription;
	private tMedianTimeSs: ISubscription;

	constructor(private globalService:GlobalService, private cdr: ChangeDetectorRef) 
	{
    	this.tErrors = "";
		this.tBalance = 0;
		this.tBlock = 0;
		this.tConnections = 0;
		this.tNetType = "";
		this.tWalletVersion = 0;
		this.tBlockStatus = "";
		
        this.tPruned = "";
		this.tDifficulty = "";
		this.tMedianTime = "";
		
	}
	
	
	GetDecimalCount(num)
	{
        var precision =  this.globalService.container.get('precision');
		
		if(precision == null || precision == undefined)
		{
			precision  =0;
		}		
		
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
	
	updateBalance(num)
	{
		this.lastNum = num;
		this.tBalance = this.GetDecimalCount(num);
		this.cdr.detectChanges();
	}
	
	checkBlockProgression()
	{
		 this.tBlock = this.cBlock;
		 this.tBlockStatus = this.cBlock + "/" + this.cBlockMax;
		 this.cdr.detectChanges();
	}
	
	
	currenctChangedEventFired()
	{
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
	 this.tDifficultySs.unsubscribe();	
	 this.tMedianTimeSs.unsubscribe();	

	 
	}
	
    ngOnInit()
	{ 
       
     this.tPrunedSs = this.globalService.tPrunedChanged$.subscribe
	 (
        value => {
        this.tPruned = value + "";
     });	

     this.tDifficultySs = this.globalService.tDifficultyChanged$.subscribe
	 (
        value => {
        this.tDifficulty = value + "";
     });	

     this.tMedianTimeSs = this.globalService.tMedianTimeChanged$.subscribe
	 (
        value => {
        this.tMedianTime = value + "";
     });		 
	   
	   
     this.tErrorsSs = this.globalService.tErrorsChanged$.subscribe
	 (
        value => {
        this.tErrors = value;
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
	  
	  
    }
}
