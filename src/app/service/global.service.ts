import { Injectable } from '@angular/core';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import * as Client from 'bitcoin-core';
import { Component, OnDestroy  } from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { PersistenceService } from 'angular-persistence';
import { StorageType } from 'angular-persistence';
import { IPersistenceContainer } from 'angular-persistence';
import {TranslateService} from '@ngx-translate/core';
import * as _lodash from "lodash";


declare var $:any;
declare var swal:any;


@Injectable()
export class GlobalService implements OnDestroy {

  public client: Client;
  public container: IPersistenceContainer;
  private rewritePath: string = "";
  public walletPrefix:string = "";

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

  private _tPrunedChange = new BehaviorSubject("");
  tPrunedChanged$ = this._tPrunedChange.asObservable();  
  private _tDifficultyChange = new BehaviorSubject("");
  tDifficultyChanged$ = this._tDifficultyChange.asObservable();  
  private _tMedianTimeChange = new BehaviorSubject("");
  tMedianTimeChanged$ = this._tMedianTimeChange.asObservable();    
  
  
  private _currencyChange = new BehaviorSubject(0);
  curerencyChanged$ = this._currencyChange.asObservable();

  announceCurrencyChange(todo) 
  {
    this._currencyChange.next(todo);
  }

  
  async walletBackUp(path)
  {
	  console.log(path);
	  
      const response = await this.client.backupwallet(path).catch(function(e) 
	  {
		     swal("Error", e, "error")
			 return [];
      });	  
	  
	  
	  swal("Back Up Done", "" + path)
	  console.log(JSON.stringify(response));
  }
  
  async getNameList()
  {
      const response = await this.client.name_list().catch(function(e) 
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
	  
      const response2 = await this.client.name_pending().catch(function(e) 
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
  
  async getNewAddress(label)
  {
      const response = await this.client.getnewaddress(label).catch(function(e) 
	  {
		     swal("Error", e, "error")
			 return [];
      });	

	  return response;
	  
  }
  
  
  async getTransactions()
  {
	  
      const response = await this.client.listTransactions().catch(function(e) 
	  {
		     swal("Error", e, "error")
			 return [];
      });	

	return response;
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
	
  getOverviewInfo()
  {

	  //Could not be connected yet, but zeroMQ my trigger this functions
	  if(this.client == null || this.client == undefined)
	  {
          console.log('skipping as null');
		  return;
	  }
	  
      let _that = this;
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
		  
		  
		  this._tPrunedChange.next(help.pruned);
		  this._tDifficultyChange.next(help.difficulty);
		  this._tMedianTimeChange.next(this.timeConverter(help.mediantime));
		  
		  
	  }
	  ).catch(function(e) 
	  {
		  
		  
         err.next(e);
		 console.log("Crash recover cookies?");
		 _that.reconnectTheClient();
		 return;
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
      const response = await this.client.name_register(nname, nvalue).catch(function(e) 
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

	 return response;  	  
  }
  
  async listLabels()
  {
      const response = await this.client.listlabels().catch(function(e) 
	  {
		     swal("Error", JSON.stringify(e), "error")
			 return false;
      });	

	 return response;  
  }  
  
  async getAddressesByLabel (label)
  {
      const response = await this.client.getaddressesbylabel(label).catch(function(e) 
	  {
		     swal("Error", JSON.stringify(e), "error")
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
  
  
  shutDown()
  {
	  
	if(this.client == null || this.client == undefined)
	{
	  window.require('electron').remote.getCurrentWindow().close();
	  return;
	}


	var _that = this;
	this.client.stop().then(
	  (help) =>  
	  {
		  
		  window.require('electron').remote.getCurrentWindow().close();
	  }
	).catch(function(e) {
		 
		  window.require('electron').remote.getCurrentWindow().close();
		 
	});		  
  }
  
  ngOnDestroy()
  {
	
	  this.client.stop().then(
		  (help) =>  
		  {
			 
		  }
	  ).catch(function(e) {
		    
	  });	  
  }
  
  reconnectTheClient()
  {
	  
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') == -1) 
	{
       return;
    }	  
	  
	  
    let _that = this;
    const path = window.require('path');
	let basepath = window.require('electron').remote.app.getPath('appData');
    let filename = path.join(basepath, './Chimaera/.cookie');
	const fs = window.require('fs');
	
    let filenameRewrite = path.join(basepath, './Chimaera/appdata.orvald');
	
	if (fs.existsSync(filenameRewrite)) 
	{
			fs.readFile(filenameRewrite, 'utf8', function(err, data) 
			{
				if (err) throw err;
				_that.rewritePath = data;
			});  	
	}	

	if(this.rewritePath == "")
	{
	}
	else
	{
	   basepath = this.rewritePath;
	   filename = path.join(basepath, './.cookie');
	}
	
	console.log("cookies:" + filename);
	
	if (!fs.existsSync(filename)) 
	{
		
			let filename2 = path.join(basepath, './Chimaera/testnet/.cookie');
			
			if(_that.rewritePath != "")
			{
			filename2 = path.join(basepath, './testnet/.cookie');
			}
			
			if (fs.existsSync(filename2)) 
			{
				filename = filename2;
			}
			else
			{
				setTimeout(function() 
				{
							
					_that.reconnectTheClient();
					
				}, 1500);		
						 
				return;
			}
		
    }	  
	  

    let host =  this.container.get('host');
		
	if(host == undefined || host == null)
	{
			host = "127.0.0.1";
	}  
	
	let port =  this.container.get('port');
		
	if(port == undefined || port == null)
	{
			port = 10133;
	}  	
  

    let contents = "";
	fs.readFile(filename, 'utf8', function(err, data) 
	{
		if (err) throw err;
		contents = data;

		let pData = contents.split(":");
		
		
		let usernameG =  _that.container.get('username');	
		if(usernameG != "" && usernameG != undefined)
		{
				pData[0] = usernameG;
		}  
		
		let passwordG =  _that.container.get('password');	
		if(passwordG != "" && passwordG != undefined)
		{
				pData[1] = passwordG;
		}  		
		
		
		
		setTimeout(function() 
		{
		console.log("All loaded, safely connect to RPC now" + pData[0] + "|" +  pData[1]);
		_that.client = new Client({ network: 'mainnet', host: host, password: pData[1], port: port, username: pData[0]});
		
			setTimeout(function() 
			{
			_that.getOverviewInfo();
			}, 1000);
		
		}, 1000);		
						
	  
	});   
	

	  
  }
	    
  
  constructor(private http: Http, public persistenceService: PersistenceService, public translate: TranslateService) 
  { 
  
    //We need to inject custom methods into bitcoin-core library
	var _methods = {
		
		getnewaddress: {
		version: '>=0.8.0'
		},
		listlabels: {
		version: '>=0.8.0'
		},
		getaddressesbylabel: {
		version: '>=0.8.0'
		},
		backupwallet: {
		version: '>=0.8.0'
		},
		name_register: {
		version: '>=0.8.0'
		},
		name_list: {
		version: '>=0.8.0'
		},
		name_pending: {
		version: '>=0.8.0'
		}			
	}

	
	
	
	_lodash.forOwn(_methods, (range, method) => 
	{
    Client.prototype[method] = _lodash.partial(Client.prototype.command, method.toLowerCase());
    });
    
   
  
    //Zeromq will not work in browser, outside electron
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') == -1) 
	{
  
    }
    else
	{
         var zmq = require('zeromq');
		var subscriber = zmq.socket('sub');
		var _that = this;
		
		subscriber.on('message', function() 
		{
		  var msg = [];
		  Array.prototype.slice.call(arguments).forEach(function(arg) 
		  {
				msg.push(arg.toString());
		  });

		  _that.getOverviewInfo();
		  
		})
		 
		subscriber.connect('tcp://127.0.0.1:28332');
		console.log('zeromq connected to port 28332');
		 
		subscriber.subscribe('rawtx');
		
		window.require('electron').remote.getCurrentWindow().on('close', () => 
		{
			   _that.client.stop().then(
					  (help) =>  
					  {


					  }
				  ).catch(function(e) {


						 
				  });	   
		})	

		
	}
		
		 

	translate.setDefaultLang('en');
	
	this.container = persistenceService.createContainer(
		'org.CHIMAERA.global',
		{type: StorageType.LOCAL, timeout: 220752000000}
	);		

	var lang = this.container.get('lang');
	
	if(lang == undefined || lang == null)
	{
		lang = "en";
	}
	
	translate.use(lang);
	

	  
      let daemonpath =  this.container.get('daemonpath');
			
      if( daemonpath == undefined ||  daemonpath == null)
	  {
				 daemonpath = "";
	  }  	  
	  
	  
	  if (window.require('electron').remote.getCurrentWindow().serve) 
	  {
		  console.log("inside1");
		  const {shell} = window.require('electron').remote;
		  
          // Open a local file in the default app
		  if(daemonpath == "")
		  {
              shell.openItem(window.require('electron').remote.app.getAppPath() + '\\daemon\\shell.vbs');
		  }
		  else
		  {
			  shell.openItem(daemonpath + '\\shell.vbs');
		  }
	      
	  }
	  else
	  {	  
  
		  const {shell} = window.require('electron').remote;
		  
          // Open a local file in the default app
		  if(daemonpath == "")
		  {
          shell.openItem(window.require('electron').remote.app.getAppPath() + '\\..\\daemon\\shell.vbs');
		  }
		  else
		  {
			  shell.openItem(daemonpath + '\\shell.vbs');
		  }
	  } 	
	
	 
	 
	this.reconnectTheClient();

  }

}
