import { Injectable } from '@angular/core';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import * as Client from 'bitcoin-core';
import { ISubscription } from "rxjs/Subscription";
import { Component, OnInit, OnDestroy  } from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { PersistenceService } from 'angular-persistence';
import { StorageType } from 'angular-persistence';
import { IPersistenceContainer } from 'angular-persistence';


declare var $:any;
declare var swal:any;


@Injectable()
export class GlobalService {

  public client: Client;
  private subscription: ISubscription;
   private container: IPersistenceContainer;


  private _tErrorsChange = new BehaviorSubject("");
  tErrorsChanged$ = this._tErrorsChange.asObservable();  
  private _tBalanceChange = new BehaviorSubject(0);
  tBalanceChanged$ = this._tBalanceChange.asObservable();  
  private _tBlockChange = new BehaviorSubject(0);
  tBlockChanged$ = this._tBlockChange.asObservable();  
  private _tConnectionsChange = new BehaviorSubject(0);
  tConnectionsChanged$ = this._tConnectionsChange.asObservable();  
  private _tNetTypeChange = new BehaviorSubject("");
  tNetTypeChanged$ = this._tNetTypeChange.asObservable();  
  private _tWalletVersionChange = new BehaviorSubject(0);
  tWalletVersionChanged$ = this._tWalletVersionChange.asObservable();  
  private _tBlockStatusChange = new BehaviorSubject("");
  tBlockStatusChanged$ = this._tBlockStatusChange.asObservable();  
  private _tBlockMaxChange = new BehaviorSubject(0);
  tBlockMaxChanged$ = this._tBlockMaxChange.asObservable();    
  
  
  private _currencyChange = new BehaviorSubject(0);
  curerencyChanged$ = this._currencyChange.asObservable();

  announceCurrencyChange(todo) 
  {
    this._currencyChange.next(todo);
  }

  async getNameList()
  {
      const response = await this.client.Name_List().catch(function(e) 
	  {
		     swal("Error", e, "error")
			 return [];
      });	

      var trObj = [];
     
	  for(var s =0; s < response.length;s++)
	  {
		  var nObj = [response[s].name, response[s].value, response[s].address];
		  trObj.push(nObj);
	  }
	  
      const response2 = await this.client.Name_Pending().catch(function(e) 
	  {
		     swal("Error", e, "error")
			 return [];
      });

	  for(var s =0; s < response2.length;s++)
	  {
		  if(response[s].ismine == true)
		  {
		  var nObj = [response[s].name, response[s].value, ""];
		  trObj.push(nObj);
		  }
	  }	  
	  
	  
	return trObj;	  
  }
  
  async getTransactions()
  {
	  
      const response = await this.client.listTransactions().catch(function(e) 
	  {
		     swal("Error", e, "error")
			 return [];
      });	

      var trObj = [];
     
	  for(var s =0; s < response.length;s++)
	  {
		  var nObj = [response[s].address, response[s].name, response[s].category, response[s].amount];
		  trObj.push(nObj);
	  }
	  
	  
	return trObj;
  }
  
  getOverviewInfo()
  {
	  var err = this._tErrorsChange;
	  this.client.getBlockchainInfo().then(
	  (help) =>  
	  {

		  this._tBlockChange.next(help.blocks);

          this._tBlockMaxChange.next(help.blocks * help.verificationprogress);
		  
		  var tNetType = "Main Net";
		  if(help.chain == "test")
		  {
			   tNetType = "Test Net";
		  }
		  
		  this._tNetTypeChange.next(tNetType);
	  }
	  ).catch(function(e) {
         err.next(e);
      });


	  var err2 = this._tErrorsChange;
	  this.client.getWalletInfo().then(
	  (help) =>  
	  {
		  this._tBalanceChange.next(help.balance);
		  this._tWalletVersionChange.next(help.walletversion);
	  }
	  ).catch(function(e) {
         err2.next(e);
      });
	  

	  var err3 = this._tErrorsChange;
	  this.client.getNetworkInfo().then(
	  (help) =>  
	  {

		  this._tConnectionsChange.next(help.connections);
		  this._tErrorsChange.next(help.warnings);
	  }
	  ).catch(function(e) {
         err3.next(e);
      });
	  
  }  
  
  async AddNewName(nname, nvalue)
  {
      const response = await this.client.Name_Register(nname, nvalue).catch(function(e) 
	  {
		     console.log(e);
		     swal("Error", e.message, "error")
			 return "";
      });	

      return response;	  
  }
  
  async sendPayment(address, amount, label, fee) :Promise<string>
  {
      const response = await this.client.validateAddress(address).catch(function(e) 
	  {
		     swal("Error", e.message, "error")
			 return false;
      });		

	 if( response.isvalid == false)
	 {
		 return "Wrong address";
	 }
	 
      const response2 = await this.client.sendToAddress(address, amount, label, "", fee).catch(function(e) 
	  {
		     swal("Error", e.message, "error")
			 return false;
      });	

	  
	 return response2;
	 
  }
  
  
  async consoleCommand(command) :Promise<string>
  {
      const response = await this.client.command(command).catch(function(e) 
	  {
			 return e;
      });	

	 return JSON.stringify(response);  	  
  }
  
  async insertReceivingAddress(label) :Promise<string>
  {
      const response = await this.client.getNewAddress(label).catch(function(e) 
	  {
		     swal("Error", e, "error")
			 return false;
      });	

	 return response;  
  }  
  
  async insertSendingAddress(address, label): Promise<boolean> 
  {
      const response = await this.client.validateAddress(address).catch(function(e) 
	  {
		     swal("Error", e, "error")
			 return false;
      });	

	 return response.isvalid;

  }
  
  ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }
  
  reconnectTheClient()
  {
   var host =  this.container.get('host');
		
	if(host == undefined || host == null)
	{
			host = "127.0.0.1";
	}  
	
	var port =  this.container.get('port');
		
	if(port == undefined || port == null)
	{
			port = 18396;
	}  	
  
	var username = this.container.get('username');
	var passwordField = this.container.get('password');
  
   this.client = new Client({ network: 'mainnet', host: host, password: passwordField, port: port, username: username});
   
   
   
   this.getOverviewInfo();
	  
  }
	  
	  
  
  constructor(private http: Http, private persistenceService: PersistenceService) 
  { 
  
   
    let timer = Observable.timer(5000,5000);
    this.subscription = timer.subscribe(t=> 
	{
		this.getOverviewInfo();
	}
	);	

	this.container = persistenceService.createContainer(
		'org.CHIMAERA.global',
		{type: StorageType.LOCAL, timeout: 220752000000}
	);	
  
    this.reconnectTheClient();
  }

}
