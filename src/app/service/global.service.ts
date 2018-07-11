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
import { Router } from '@angular/router';
import * as zmq from 'zeromq';
 
declare var $:any;
declare var swal:any;


@Injectable()
export class GlobalService implements OnDestroy {

  public client: Client;
  
  private clientMain: Client;
  private clientVault: Client;
  public inSynch: boolean = false;
  private encryptStatus: number = -1;
  private firsTimeConnected: boolean = false;
  
  public container: IPersistenceContainer;
  private rewritePath: string = "";
  public walletType: string = "default";
  private unlockTime:string = "";

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
  
  private _walletChange = new BehaviorSubject(0);
  walletChanged$ = this._walletChange.asObservable();
  
  
  private lastBalance: number = 0;
  private lastBalanceVault: number = 0;
  private lastBalanceGame: number = 0;
  private timestemp:number  =0;
  
  private subscriber;
  
  private lastKnownBlockDiff:number = 51;

  announceCurrencyChange(todo) 
  {
    this._currencyChange.next(todo);
  }

  
  async walletBackUp(path, type)
  {
	 
	  if(type == 0)
	  {
		  const response = await this.clientMain.backupWallet(path).catch(function(e) 
		  {
				 swal(this.translate.instant('SOVERVIEW.ERROR'), e, "error")
				 return [];
		  });	 
	  }	  
	  else
	  {
		  const response = await this.clientVault.backupWallet(path).catch(function(e) 
		  {
				 swal(this.translate.instant('SOVERVIEW.ERROR'), e, "error")
				 return [];
		  });		  
	  }
	  
	  
	  swal(this.translate.instant('SOVERVIEW.BUDONE'), "" + path)
	
  }
  
  getWalletTypeName()
  {
	 if(this.walletType == "default")
	 {
		 return this.translate.instant('SOVERVIEW.VAULTWALLET');
	 }		 
	 else
	 {
		 return this.translate.instant('SOVERVIEW.GAMEWALLET');
	 }
  }
  
  async encryptWallet(passkey)
  {
	  
	  let _that = this;
      const response = await this.client.encryptWallet(passkey).catch(function(e) 
	  {
		     swal(this.translate.instant('SOVERVIEW.ERROR'), e, "error");
			 return [];
      });	 

	  swal("", JSON.stringify(response), "success");
	  
	  if(JSON.stringify(response).length > 10)
	  {
			setTimeout(function() 
			{
				_that.shutDown();
				
			}, 5000);		  
	  }
  }
  
  async updateName(name, value, address)
  {

      
      let response;
	  
	  if(address != "")
	  {

          var objToSend = {destAddress:address};
		  
		  response = await this.client.name_update(name, '{}', objToSend).catch(function(e) 
		  {
				 return JSON.stringify(e);
		  });	
	  }	  
	  else
	  {
		  response = await this.client.name_update(name,value).catch(function(e) 
		  {
				 return JSON.stringify(e);
		  });		  
	  }

	  if(response != null)
	  {
	    swal(this.translate.instant('SCHIMAERA.RESPONSE'), JSON.stringify(response));  
	  }
	  else
	  {
		  swal(this.translate.instant('SOVERVIEW.SUCCESS'), this.translate.instant('SOVERVIEW.UPDATED'));  
		  
	  }	  
	  
	  return JSON.stringify(response);
  }
  
  async unlockWallet(passkey)
  {
      const response = await this.client.walletPassphrase(passkey, 100).catch(function(e) 
	  {
			 return JSON.stringify(e);
      });	 

	  if(response != null)
	  {
	    swal(this.translate.instant('SCHIMAERA.RESPONSE'), JSON.stringify(response));  
	  }
	  else
	  {
		  this.encryptStatus = 2;
		  this.getOverviewInfo();
		  return "Success";
		  
	  }
  }
  
  async getNameList()
  {
      const response = await this.client.name_list().catch(function(e) 
	  {
		     swal(this.translate.instant('SOVERVIEW.ERROR'), e, "error");
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
		     swal(this.translate.instant('SOVERVIEW.ERROR'), e, "error");
			 return [];
      });

	  for(var s =0; s < response2.length;s++)
	  {
		  if(response2[s].ismine == true)
		  {
		  var nObj = [response2[s].name, response2[s].value, this.translate.instant('SOVERVIEW.PENDING')];
		  trObj.push(nObj);
		  }
	  }	  
	  
	  
	return trObj;	  
  }
  
  async getNewAddress(label)
  {
      const response = await this.client.getNewAddress(label).catch(function(e) 
	  {
		     swal(this.translate.instant('SOVERVIEW.ERROR'), e, "error");
			 return [];
      });	

	  return response;
	  
  }
  
  
  async getTransactions(start)
  {
	  
      const response = await this.client.listTransactions("*", 10, start).catch(function(e) 
	  {
		     swal(this.translate.instant('SOVERVIEW.ERROR'), e, "error");
			 return [];
      });	

	  
	return response;
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
  
  getEncryptStatus()
  {
	  return this.encryptStatus;
  }
	
  getBalanceString()
  {
	  if(this.walletType == "default")
	  {
	     return this.translate.instant("SOVERVIEW.VAULTWALLET") + " " + this.lastBalance + " CHI";
	  }
	  else
	  {
		 return this.translate.instant("SOVERVIEW.GAMEWALLET") + " " + this.lastBalance + " CHI"; 
	  }
  }	  
  
  async updateWalletBalances1()
  {
      var err2 = this._tErrorsChange;
	  await this.clientMain.getWalletInfo().then(
	  (help) =>  
	  {

		  this.lastBalanceVault =  help.balance;
		  		  
       
	  }
	  ).catch(function(e) 
	  {
         err2.next(e);
      });	  
  }
  
  
  async updateWalletBalances2()
  {
           var err2 = this._tErrorsChange;
		  await this.clientVault.getWalletInfo().then(
		  (help) =>  
		  {
			  this.lastBalanceGame =  help.balance;
			  
			  
			  if( this.walletType == "default")
			  {
				  this.lastBalance = this.lastBalanceVault;
			  }
			  else
			  {
				  this.lastBalance = this.lastBalanceGame;
			  }
		  }
		  ).catch(function(e) 
		  {
			 err2.next(e);
		  });

  
  }  
  
  getBalanceVaultString()
  {
	  return " " + this.lastBalanceVault + " CHI";
  }	 

  getBalanceGameString()
  {
	  return " " + this.lastBalanceGame + " CHI";
  }	   
  
  
 
  
  testIfLastBlock()
  {
	
	  let curTime = Date.now();
	  
	  if(this.timestemp == 0)
	  {
		  this.timestemp = curTime;
		  return;
	  }
	  
	  if(curTime - this.timestemp > 5000)
	  {
		  this.getOverviewInfo();
	  }
	  
	  
	   this.timestemp = curTime;
	  
  }
	
  getOverviewInfo()
  {

      //Lets prevent spamming on initial synchronization
	  let _that = this;
	  
	  

	  
	  if (this.inSynch == false && this.lastKnownBlockDiff < 50)
	  {
			  
			//Underlying zeromq library seems to be having memory troubles
            //So, during synchronization, we have to reinit it to allow 
            //for cpu/memory to be freed
            
			this.subscriber.unsubscribe('raw');	
			this.subscriber.disconnect('tcp://127.0.0.1:28332');
			this.subscriber = null;

			setTimeout(function() 
			{
				_that.connectZeroMQ();
				
			}, 3000);	
			
			let curTime = Date.now();
			this.timestemp = curTime;
	  }
	  else
	  {
	  }
	  
	  
	  
	  if (this.inSynch == false )
	  {
		//For the last bunch of block, zeromq will not arrive on synch, so we need this final extra check
		setTimeout(function() 
		{
			_that.testIfLastBlock();
			
		}, 6000);	
	  }

		
	  
	  //Could not be connected yet, but zeroMQ my trigger this functions
	  if(this.client == null || this.client == undefined)
	  {
		  return null;
	  }
	  
	  
     
	  var err = this._tErrorsChange;
	  this.client.getBlockchainInfo().then(
	  (help) =>  
	  {
		  
		  if(_that.firsTimeConnected == false)
		  {
			 _that.firsTimeConnected = true;
		     console.log(this.translate.instant('SOVERVIEW.CONNECTED'));
		  }
		  
		  _that._tBlockChange.next(help.blocks);
          _that._tBlockMaxChange.next(help.headers);
          _that.lastKnownBlockDiff = 0;
		  
		  if(help.blocks == help.headers && help.headers > 0)
		  {
			  _that.inSynch = true;
		  }
		  
		  let tNetType = "Main Net";
		  if(help.chain == "test")
		  {
			   tNetType = "Test Net";
			   
			  		   

		  }
		  
		  _that._tNetTypeChange.next(tNetType);
		  
		  
		  _that._tPrunedChange.next(help.pruned);
		  _that._tDifficultyChange.next(help.difficulty);
		  _that._tMedianTimeChange.next(_that.timeConverter(help.mediantime));
		  
		  
	  }
	  ).catch(function(e) 
	  {
		  
		 console.log(this.translate.instant('SOVERVIEW.ERROR') + ":" + JSON.stringify(e));
         err.next(e);
		
		 _that.reconnectTheClient();
		 return null;
      });

	  var err2 = this._tErrorsChange;
	  this.client.getWalletInfo().then(
	  (help) =>  
	  {
		  this._tBalanceChange.next(help.balance);


		  if(help.hasOwnProperty("unlocked_until"))
		  {
			  if(help.unlocked_until > 0)
			  {
				  this.encryptStatus  = 2;
				  this.unlockTime = this.timeConverter(help.unlocked_until);
			  }
			  else
			  {
				  this.encryptStatus  = 1;
			  }
		  }
		  else
		  {
			  this.encryptStatus  = 0;

		  }
		  
		  this._tWalletVersionChange.next(help.walletversion);
	  }
	  ).catch(function(e) {
         err2.next(e);
		 return null;
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
		 return null;
      });
	  
	  return null;
	  
  }  
  
  
  async AddNewName(nname, nvalue)
  {
	  nvalue = '{"' + nname + '":"' + nvalue + '"}';

      const response = await this.client.name_register(nname, nvalue).catch(function(e) 
	  {
			 return JSON.stringify(e);
      });	

	  
      return response;	  
  }
  
  async sendPayment(address, amount, label, fee) :Promise<string>
  {
      const response = await this.client.validateAddress(address).catch(function(e) 
	  {
			 return false;
      });		

	 if( response.isvalid == false)
	 {
		 return this.translate.instant('SSEND.WRONGADDRESS');
	 }
	 
      const response2 = await this.client.sendToAddress(address, amount, label, "", fee).catch(function(e) 
	  {
		    
			 return JSON.stringify(e.message);
      });	

	  
	 return response2;
	 
  }
  
 
  
  async consoleCommand(command) :Promise<string>
  {
	  
	  let constructCommand = command.split(" ");
	  
	  
	  if(constructCommand.length > 1)
	  {
	  
		  let tVal = parseInt(constructCommand[1]);
		  
		  if(tVal != NaN)
		  {
			  constructCommand[1] = tVal;
		  }
	  }
	  
      if(constructCommand.length > 2)
	  {
	  
		  let tVal = parseInt(constructCommand[2]);
		  
		  if(tVal != NaN)
		  {
			  constructCommand[2] = tVal;
		  }	  
	  
	  }

	  let response;
	  if(constructCommand.length == 1)
	  {
		  
		   response = await this.client.command(constructCommand[0]).catch(function(e) 
		  {
				 return e;
		  });	
		  
	  }
	  else if(constructCommand.length == 2)
	  {
		   response = await this.client.command(constructCommand[0], constructCommand[1]).catch(function(e) 
		  {
				 return e;
		  });
	  }
	  else if(constructCommand.length == 3)
	  {
		   response = await this.client.command(constructCommand[0], constructCommand[1], constructCommand[2]).catch(function(e) 
		  {
				 return e;
		  });
	  }	  


	 return response;  	  
  }
  
  async listLabels()
  {
      const response = await this.client.listlabels().catch(function(e) 
	  {
		     swal(this.translate.instant('SOVERVIEW.ERROR'), JSON.stringify(e), "error")
			 return false;
      });	

	 return response;  
  }  
  
  async getAddressesByLabel (label)
  {
      const response = await this.client.getaddressesbylabel(label).catch(function(e) 
	  {
		     swal(this.translate.instant('SOVERVIEW.ERROR'), JSON.stringify(e), "error")
			 return false;
      });	

	 return response;  
  }    
  
  async insertSendingAddress(address, label): Promise<boolean> 
  {
      const response = await this.client.validateAddress(address).catch(function(e) 
	  {
		     swal(this.translate.instant('SOVERVIEW.ERROR'), e, "error")
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
  
  getDefaultPort()
  {
	  
    let port = this.container.get('port');
		
	if(port == undefined || port == null)
	{
			port = 18396;
	}  		

    return 	port;
	  
  }
  
 
  
  connectZeroMQ()
  {
    let _that = this;
	this.subscriber = zmq.socket('sub');
	this.subscriber.on('message', (topicRaw: Buffer, bodyRaw: Buffer, ...tailRaw: Buffer[]) => 
	{

		const topic = topicRaw.toString();


		if (topic == 'rawtx') 
		{
			_that.lastKnownBlockDiff++;
			
			
			//TODO - properly decode and check the logic before the notification
			if(this.inSynch)
			{
				//const main = window.require('electron').remote.require('./main.js');
				//main.NotifyTransaction("NewTransactionTitle", "NewTransaction");
			}
			
			_that.getOverviewInfo();

		} 
		else if (topic == 'rawblock') 
		{
			 _that.lastKnownBlockDiff++;
			_that.getOverviewInfo();
			
		}
	});
	 
	this.subscriber.connect('tcp://127.0.0.1:28332');
	this.subscriber.subscribe('raw');	  
  }
  
  reconnectTheClient()
  {
	
	console.log(this.translate.instant('SOVERVIEW.RECONNECTING'));
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') == -1) 
	{
       return;
    }	  
	  
	  
    let _that = this;
    const path = window.require('path');
	let basepath = window.require('electron').remote.app.getPath('appData');
	
      let testnet =  this.container.get('testnet');
	  if(testnet == undefined ||  testnet == null)
	  {
			 testnet = true; //TODO - change after wallet goes life to false
	  } 	  	
	
    let filename = path.join(basepath, './Xaya/.cookie');
	
	if(testnet == true)
	{
		filename = path.join(basepath, './Xaya/testnet/.cookie');
	}
	
	const fs = window.require('fs');
	
    let filenameRewrite = path.join(basepath, './Xaya/appdata.orv');
	
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
	   
	   if(testnet == true)
	   {
		filename = path.join(basepath, './testnet/.cookie');
	   }
	   
	}
	
	
	if (!fs.existsSync(filename)) 
	{
		setTimeout(function() 
		{
					
			_that.reconnectTheClient();
			
		}, 1500);		
				 
		return;	
    }	  
	  

    let host =  this.container.get('host');
		
	if(host == undefined || host == null)
	{
			host = "127.0.0.1";
	}  
	
	let port =  this.getDefaultPort();
  

    let contents = "";
	
	console.log(this.translate.instant('SOVERVIEW.GCOKKIES'));
	
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
		
		
		console.log(_that.translate.instant('SOVERVIEW.CTORPC') + port);
		setTimeout(function() 
		{
		
		
		_that.clientMain = new Client({ network: 'mainnet', wallet: "vault.dat", host: host, password: pData[1], port: port, username: pData[0]});
		_that.clientVault= new Client({ network: 'mainnet', wallet: "game.dat", host: host, password: pData[1], port: port, username: pData[0]});
		_that.client = _that.clientMain;
			setTimeout(function() 
			{
			_that.getOverviewInfo();
			}, 1000);
		
		}, 1000);		
		
		
		
						
	  
	});   
	

	  
  }
  
  getOverviewIfConnected()
  {
	  if(this.inSynch)
	  {
	     this.getOverviewInfo();
	  }
  }
  
  refreshCurrentPageDaemonInfo(name)
  {
	  if (this.router.url == "/dashboard")
	  {
	     this.getOverviewInfo();
	  }
	  else
	  {
		   this._walletChange.next(name);
	  }

	  
	  
  }
  
  
  getUnlockedText()
  {
	  return this.translate.instant('SOVERVIEW.UNLOCKTEXT') + ": " + this.unlockTime;
  }
  
  setWalletDefault()
  {
	  this.client = this.clientMain;
	  this.walletType = "default";
	  this.encryptStatus  = -1;
	  this.refreshCurrentPageDaemonInfo("default");
	  
  }
  
  setWalletGame()
  {
	  this.client = this.clientVault;
	  this.walletType = "game";
	  this.encryptStatus  = -1;
	  this.refreshCurrentPageDaemonInfo("game");
  }
	    
  
  rescaleTheWindow(width, height)
  {
	 //Lets have 1280x720 as default, else resize proportionally to width
	let zoomFactor = 1;
	
	if(width > 1280) 
	{
		zoomFactor = width / 1280;
	}
	
    window.require('electron').webFrame.setZoomFactor(zoomFactor);	  
  }
  
  constructor(private http: Http, public persistenceService: PersistenceService, public translate: TranslateService, private router: Router) 
  { 
  
    this.inSynch = false;
    let _that = this;
    //Zeromq will not work in browser, outside electron
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') == -1) 
	{
  
    }
    else
	{
		
		
	this.connectZeroMQ();
	
	
	
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
		'org.XAYA.global',
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
	  
	  
	  daemonpath = ""; // Right now we ommited custom daemon overwrite, but lets keep all code here intact for awhile, just forcing it to empty
	  
	  let rundaemon =  this.container.get('rundaemon');
	  if(rundaemon == undefined ||  rundaemon == null)
	  {
			 rundaemon = true;
	  } 
	  
	  
	  let testnet =  this.container.get('testnet');
	  if(testnet == undefined ||  testnet == null)
	  {
			 testnet = true; //TODO - change after wallet goes life to false
	  } 	  
	  let shellName = "shell.vbs";
	  
	  
	  if(testnet == false)
	  {
		  shellName = "shell_main.vbs";
		  
		  
          const main = window.require('electron').remote.require('./main.js');
		  main.SetMainNetTray();		  
		  
	  }
	  
	  if(rundaemon)
	  {
		  if (window.require('electron').remote.getCurrentWindow().serve) 
		  {
			 
			  const {shell} = window.require('electron').remote;
			  
			  
			  if(daemonpath == "")
			  {
				  shell.openItem(window.require('electron').remote.app.getAppPath() + '\\daemon\\' + shellName);
			  }
			  else
			  {
				  shell.openItem(daemonpath + '\\' + shellName);
			  }
			  
		  }
		  else
		  {	  
	  
			 
			  const {shell} = window.require('electron').remote;
			  
			  
			  if(daemonpath == "")
			  {
			  shell.openItem(window.require('electron').remote.app.getAppPath() + '\\..\\daemon\\' + shellName);
			  }
			  else
			  {
				  shell.openItem(daemonpath + '\\' + shellName);
			  }
		  } 	
	  }
	
	 
	 
	this.reconnectTheClient();
	
	
 
    window.require('electron').ipcRenderer.on('resized', function(event, width, height) 
	{
        _that.rescaleTheWindow(width, height);
    });

  }

}
