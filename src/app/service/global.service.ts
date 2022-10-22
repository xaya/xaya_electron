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
  private clientChatDaemon: Client;
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
  private stopZeroMQSpam: boolean = false;
  
  private execChatFile;
  private subscriber;
  

  announceCurrencyChange(todo) 
  {
    this._currencyChange.next(todo);
  }

  
  IsJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
  }  
  
  async walletBackUp(path, type)
  {
	  
		swal({
		  title: this.translate.instant('SOVERVIEW.PROCESSING'),
		  text: this.translate.instant('SOVERVIEW.PWAIT'),
		  showConfirmButton: false,
		  allowOutsideClick: false
		});	  
	  
	  
	  let response;
	  if(type == 0)
	  {
		  response = await this.clientMain.backupWallet(path).catch(function(e) 
		  {
				 return e;
		  });	 
	  }	  
	  else
	  {
		  response = await this.clientVault.backupWallet(path).catch(function(e) 
		  {
				 return e;
		  });		  
	  }
	  
	  
	  if(response == null)
	  {
	      swal(this.translate.instant('SOVERVIEW.BUDONE'),  this.translate.instant('SOVERVIEW.BUDONE'), "success");
	  }
	  else
	  {
	      swal(this.translate.instant('SOVERVIEW.PERROR'),  JSON.stringify(response), "error");
	  }
	
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
		  if(response[s].ismine == true)
		  {
			  var nObj = [response[s].name, response[s].value, response[s].address];
			  trObj.push(nObj);
		  }
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
  
  
  async getAllTransactions()
  {
	  
      const response = await this.client.listTransactions("*", 999999, 0).catch(function(e) 
	  {
		     swal(this.translate.instant('SOVERVIEW.ERROR'), e, "error");
			 return [];
      });	

	  
	return response;
  }  
  
  async getTransactions(start)
  {
	  
      const response = await this.client.listTransactions("*", 11, start).catch(function(e) 
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
	  
	  if(this.walletType != "default")
	  {
		  return 1;
	  }
	  
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
	  
      if(_that.firsTimeConnected == true)
	  {
		  if (this.inSynch == false)
		  {
				let curTime = Date.now();
				this.timestemp = curTime;
		  }
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
		     console.log(_that.translate.instant('SOVERVIEW.CONNECTED'));
		  }
		  
		  
		  _that._tBlockChange.next(help.blocks);
          _that._tBlockMaxChange.next(help.headers);
		  
		  if(help.blocks == help.headers && help.headers > 0)
		  {
			  _that.inSynch = true;
		  }
		  
		  //Lets warn people that we have progress on initial synch
		  if(help.blocks == 0)
		  {
			    setTimeout(function() 
				{
				   _that.getOverviewInfo();
				   
				}, 5000);				  
		  }
		  
		  
		  let tNetType = "Main Net";
		  if(help.chain == "test")
		  {
			   tNetType = "Test Net";
		  }
		  
		  _that._tNetTypeChange.next(tNetType);
		  
		  
		  _that._tPrunedChange.next(help.pruned);
		  _that._tDifficultyChange.next(help.difficulty);
		  
		  _that.client.getBlockHash(help.blocks).then(
	     (hash) =>  
	     {
		    	_that.client.getBlock(hash,1).then(
	            (blockinfo) =>  
	            {
					_that._tMedianTimeChange.next(_that.timeConverter(blockinfo.time));
					return null;
				}
				) 
				return null;
	     }
		 ) 	
         return null;		 
	  }
	  ).catch(function(e) 
	  {
		  
		 console.log(_that.translate.instant('SOVERVIEW.ERROR') + ":" + JSON.stringify(e));
         err.next(e);
		
		 _that.reconnectTheClient();
		 return null;
      });

	  var err2 = this._tErrorsChange;
	  this.client.getWalletInfo().then(
	  (help) =>  
	  {
		  _that._tBalanceChange.next(help.balance);


		  if(help.hasOwnProperty("unlocked_until"))
		  {
			  if(help.unlocked_until > 0)
			  {
				  _that.encryptStatus  = 2;
				  _that.unlockTime = _that.timeConverter(help.unlocked_until);
			  }
			  else
			  {
				  _that.encryptStatus  = 1;
			  }
		  }
		  else
		  {
			  _that.encryptStatus  = 0;

		  }
		  
		  return null;

	  }
	  ).catch(function(e) {
         err2.next(e);
		 return null;
      });
	  

	  var err3 = this._tErrorsChange;
	  this.client.getNetworkInfo().then(
	  (help) =>  
	  {

		  _that._tConnectionsChange.next(help.connections);
		  _that._tErrorsChange.next(help.warnings);
		  _that._tWalletVersionChange.next(help.version);
		  
		  return null;
	  }
	  ).catch(function(e) {
         err3.next(e);
		 return null;
      });
	  
	  return null;
	  
  }  
  
  async AuthWithWallet(name, application)
  {
	  
	  if(this.walletType != "game")
	  {
	   swal(this.translate.instant('CHAT.WRONGWALLET'), this.translate.instant('CHAT.WRONGWALLET'), "error");
	   return;
	  }
	  
	  
      let response = await this.clientChatDaemon.authwithwallet({"name": name, "application": application, "data": {}}).catch(function(e) 
	  {
			 return JSON.stringify(e);
      });		

      swal(this.translate.instant('CHAT.DONEPASS'), response.data, "success");	  
  }
  
  async getChatNameList(names)
  {
	  let namesAndSIgners = [];
	  
	  for(var d = 0; d < names.length;d++)
	  {
		  let shortsr = names[d].value.substring(2);
		  let response = await this.clientChatDaemon.getnamestate({"name": shortsr}).catch(function(e) 
	      {
			 return JSON.stringify(e);
          });	
		  
		  
		  
		  let entry = [];
		  if(response.data.signers.length != 0)
		  {
			  entry.push(shortsr);
			  entry.push(response.data.signers[0].addresses[0]);
			  namesAndSIgners.push(entry);
		  }
		  
	  }
	  
	  return namesAndSIgners;
  }
  
  async AddNewChatName(nname)
  {
      let addressval = await this.client.getNewAddress("", "legacy").catch(function(e) 
	  {
			 return JSON.stringify(e);
      });	

	  
      var g = {"g": [addressval]};
	  var s = {"s": g};
	  var id = {"id": s};
	  var objToSend = {"g": id};
	  
		  
	  let response = await this.client.name_update(nname, JSON.stringify(objToSend)).catch(function(e) 
	  {
				 return JSON.stringify(e);
	  });	
	  
	  console.log(JSON.stringify(objToSend));
	  console.log(JSON.stringify(response));
	  
      return response;	  
  }
  
  async AddNewName(nname, nvalue)
  {
	  if(nvalue == null || nvalue == undefined || nvalue == "")
	  {
		  nvalue = "{}";
	  }

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
  
  async GetChatStatus()
  {
	  if(this.execChatFile == null)
	  {
		  return this.translate.instant('CHAT.NOT_RUNNING');
	  }
	  else
	  {
		  
          let response = await this.clientChatDaemon.getnamestate({"name": "ryumaster"}).catch(function(e) 
	      {
				 return "Error";
		  });	
		  
		  if(response.state != "up-to-date")
		  {
			  let response2 = await this.client.getBlockchainInfo().catch(function(e) 
			  {
					 return "Error";
			  });	
			  return this.translate.instant('CHAT.NOT_UPTODATE') + " " + response.height + "/" + response2.blocks;
		  }
		
		  return this.translate.instant('CHAT.RUNNING');  
	  }
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
	  
      if(constructCommand.length > 3)
	  {
	  
		  let tVal = parseInt(constructCommand[3]);
		  
		  if(tVal != NaN)
		  {
			  constructCommand[3] = tVal;
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
	  else if(constructCommand.length == 4)
	  {
		   response = await this.client.command(constructCommand[0], constructCommand[1], constructCommand[2], constructCommand[3]).catch(function(e) 
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
  
  shutDownButNotClose()
  {
	  
	if(this.client == null || this.client == undefined)
	{
	  return false;
	}
	
    let rundaemon =  this.container.get('rundaemon');
			
	if( rundaemon == undefined ||  rundaemon == null)
	{
	   rundaemon = true;
	} 		
	
	if(!rundaemon)
	{
		return true;
	}

	var _that = this;
	this.client.stop().then(
	  (help) =>  
	  {
		  return true;
	  }
	).catch(function(e) 
	{
		  return false;
	});		  
  }  
  
  closeWithoutShutDown()
  {
	window.require('electron').remote.getCurrentWindow().close();  
  }
  
  shutDown()
  {
	  
	if(this.client == null || this.client == undefined)
	{
	  window.require('electron').remote.getCurrentWindow().close();
	  return;
	}

	
    let rundaemon =  this.container.get('rundaemon');
			
	if( rundaemon == undefined ||  rundaemon == null)
	{
		rundaemon = true;
	}  		
	
	if(!rundaemon)
	{
		window.require('electron').remote.getCurrentWindow().close();
	}
	else
	{
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
  }
  
  ngOnDestroy()
  {
	
      let rundaemon =  this.container.get('rundaemon');
			
	  if( rundaemon == undefined ||  rundaemon == null)
	  {
		rundaemon = true;
	  } 	
	
	  if(rundaemon)
	  {
		  this.client.stop().then(
			  (help) =>  
			  {
				 
			  }
		  ).catch(function(e) {
				
		  });	  
	  }
	  
	  this.closeChatApplication();
  }
  
  getDefaultPort()
  {
	  
    let port = this.container.get('port');
		
	if(port == undefined || port == null)
	{
			port = 8396;
	}  		

    return 	port;
	  
  }
  
 
  
  connectZeroMQ()
  {
    let _that = this;
	this.subscriber = zmq.socket('sub');
	this.subscriber.on('message', (topicRaw: Buffer, bodyRaw: Buffer, ...tailRaw: Buffer[]) => 
	{
		
		if(_that.stopZeroMQSpam)
		{
			return;
		}
		
		_that.stopZeroMQSpam = true;
		
		setTimeout(function() 
		{
					
			_that.stopZeroMQSpam = false;
			
		}, 5000);	
		
		const topic = topicRaw.toString();
		
		
		if(_that.inSynch == false && _that.client != undefined)
		{
		
			var err2 = this._tErrorsChange;
			_that.client.getWalletInfo().then(
			(help) =>  
			{
			  _that._tBalanceChange.next(help.balance);
			  return null;

			}
			).catch(function(e) {
			 err2.next(e);
			 return null;
			});	
		}

		if (topic == 'rawtx') 
		{
			//TODO - properly decode and check the logic before the notification
			if(!this.inSynch)
			{
				//const main = window.require('electron').remote.require('./main.js');
				//main.NotifyTransaction("NewTransactionTitle", "NewTransaction");
				
				
			}
			
			_that.getOverviewInfo();
		} 
		else if (topic == 'rawblock') 
		{
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
			 testnet = false;
	} 	  	
	
    let filename = path.join(basepath, './Xaya/.cookie');
	
	if(testnet == true)
	{
		filename = path.join(basepath, './Xaya/testnet/.cookie');
	}
	
	const fs = window.require('fs');
	
    let filenameRewrite = path.join(basepath, './Xaya/appdata.orv');
	
	
	let dirpath = this.container.get('dirpath');
	
	if(dirpath == undefined || dirpath == null)
	{
			dirpath = "";
	}  		
	
	if (fs.existsSync(filenameRewrite) && dirpath != "") 
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
	
	let readFromFile = true;
	
	if (!fs.existsSync(filename)) 
	{
			 
		let usernameT =  this.container.get('username');	 
		if(usernameT != "" && usernameT != undefined)
		{
			readFromFile = false;
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
	
	let port =  this.getDefaultPort();
  

    let contents = "";
	
	console.log(this.translate.instant('SOVERVIEW.GCOKKIES'));
	
	
	if(readFromFile)
	{
		fs.readFile(filename, 'utf8', function(err, data) 
		{
			if (err) throw err;
			contents = data;
			_that.continueConnect(readFromFile, port, host,contents);
		}); 
	}
	else
	{
	  this.continueConnect(readFromFile, port, host, "");
	}
	  
  }
  
  continueConnect(readFromFile, port, host, contents)
  {
	 
	let _that = this;
    let pData = ["",""];

	if(readFromFile)
	{
      pData = contents.split(":");
	}
	
	let usernameG =  this.container.get('username');	
	if(usernameG != "" && usernameG != undefined)
	{
			pData[0] = usernameG;
	}  
	
	let passwordG =  this.container.get('password');	
	if(passwordG != "" && passwordG != undefined)
	{
			pData[1] = passwordG;
	}  		
	
	
	console.log(_that.translate.instant('SOVERVIEW.CTORPC') + port);
	setTimeout(function() 
	{
	
	//We have reports about always resynching wallets, lets try and catch the issue here
	//as it might be related to folder being quarantied by antivirus
	const fs = window.require('fs');
	const path = window.require('path');
	let basepath = window.require('electron').remote.app.getPath('appData');
	let filenameCheck = path.join(basepath, './Xaya/');
    let filenameCheckWallets = path.join(basepath, './Xaya/wallets/');
	
	if (!fs.existsSync(filenameCheck)) 
	{
		swal("Can not detect daemon folder. Please take screenshot and report to Discord", "error", "error")
	}	
	
    
	
	_that.clientMain = new Client({ network: 'mainnet', wallet: "vault.dat", host: host, password: pData[1], port: port, username: pData[0]});
	_that.clientVault= new Client({ network: 'mainnet', wallet: "game.dat", host: host, password: pData[1], port: port, username: pData[0]});
	_that.client = _that.clientMain;
		setTimeout(function() 
		{
		_that.getOverviewInfo();
		_that.openChatApplication(pData[0], pData[1], port, host);	
        
        // After Bitcoin Core update, we need to create wallets manually if missing
        if (!fs.existsSync(filenameCheckWallets)) 
	    {
            _that.client.createWallet("vault.dat");
            _that.client.createWallet("game.dat");
        }
        
		
		}, 5000);
	
	}, 1000);		
		
	 
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
  
  openChatApplication(_username, _password, _port, _host)
  {
    const execFile = window.require('child_process').execFile;
	var _that = this;
	
	if(this.execChatFile == null)
	{
        let _that = this;
        const path = window.require('path');
	    let basepath = window.require('electron').remote.app.getPath('appData');
        
        basepath = basepath.replace(/[^\x00-\x7F]/g, "n");
        
	
	    let chatDataDir = path.join(basepath, './XAYA-Electron/xiddatadir/');
		let chatExePath = window.require('electron').remote.app.getAppPath() + '\\daemon\\' + "xid.exe";
		
		if (!window.require('electron').remote.getCurrentWindow().serve) 
		{
           chatExePath = window.require('electron').remote.app.getAppPath() + '\\..\\daemon\\' + "xid.exe";	
		}
		
		let eargs1 = '--xaya_rpc_url=http://'+_username+':'+_password+'@'+_host+':'+_port + "/wallet/game.dat";
        let eargs2 = '--datadir=' + chatDataDir;
        let eargs3 = '--game_rpc_port=8400';
		let eargs4 = '--allow_wallet'
		
		this.execChatFile = execFile(chatExePath, [eargs1, eargs2, eargs3,eargs4], {maxBuffer: 1024 * 2000000}, (error, stdout, stderr) => 
		{
			if (error) 
			{
				//console.log('cerr: ' + stderr);
				_that.execChatFile = null;
				//swal(this.translate.instant('ERROR'),  error + "<<>>" + stdout + "<<>>" + stderr, "error");
				setTimeout(function() 
		        {
		        _that.openChatApplication(_username, _password, _port, _host);	
		        }, 5000);
				
				
				return;
			}

			_that.execChatFile.on('exit', function (code) 
			{ 
			 _that.execChatFile = null;
			 return;
			});
		});	 
		
		_that.clientChatDaemon = new Client({ version: '0.15.1', network: 'chat', host: _host, password: "", port: 8400, username: ""});
	}		  
  }
  
  closeChatApplication()
  {
	 if(this.execChatFile != null)
	 {
		 this.execChatFile.stdin.end();
		 this.execChatFile.stdout.destroy();
		 this.execChatFile.stderr.destroy();
		 this.execChatFile.kill();
		 this.execChatFile = null;
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
	
	if(lang == undefined || lang == null || lang == "en")
	{
		lang = "gb";
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
			 testnet = false;
	  } 	  
	  let shellName = "shell.vbs";
      const main = window.require('electron').remote.require('./main.js');
	  
	  if(testnet == false)
	  {
		  shellName = "shell_main.vbs";
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
