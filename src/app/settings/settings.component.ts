import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { GlobalService } from '../service/global.service';
import {TranslateService} from '@ngx-translate/core';

declare var $:any;
declare var swal:any;



@Component({
  selector: 'settings-cmp',
  templateUrl: './settings.component.html'
})


export class SettingsComponent {


    public host: string  = "";
    public port: number  = 0;
    public username: string  = "";
	public password: string  = "";
	public dirpath: string = "";
	private dirpathorig:string = "";
	public daemonpath: string = "";
	private daemonpathorig:string = "";
	
	public usedefault:boolean = true;
	public rundaemon:boolean = true;
	public testnet:boolean = true;
	
	public usernameOrig:string = "";
	public passwordOrig:string = "";
	
	public defaultClass: string = "";
	public advancedClass: string = "";
	
	private clearPathShedule: boolean = false;
	private currentTestnet:boolean = true;
	
	constructor(private translate: TranslateService, private globalService:GlobalService, private cdr: ChangeDetectorRef) 
	{

		this.host =  this.globalService.container.get('host');
			
		if( this.host == undefined ||  this.host == null)
		{
				 this.host = "127.0.0.1";
		}  
		
        this.usedefault =  this.globalService.container.get('usedefault');
			
		if( this.usedefault == undefined ||  this.usedefault == null)
		{
				 this.usedefault = true;
		}  		
		
		if(this.usedefault)
		{
			this.defaultClass = "selected";
			this.advancedClass  = "";
           	
		}
		else
		{
			this.defaultClass = "";
			this.advancedClass  = "selected";	
			
		}
		
		this.port =  this.globalService.getDefaultPort();
			

 		this.username =  this.globalService.container.get('username');
			
		if( this.username == undefined ||  this.username == null)
		{
				 this.username = "";
		}  
		
		this.usernameOrig = this.username;
		
		this.password =  this.globalService.container.get('password');
			
		if(this.password == undefined || this.password == null)
		{
				this.password = "";
		}  	 
		
		this.passwordOrig = this.password;
		
		this.dirpath = this.globalService.container.get('dirpath');
		
		if(this.dirpath == undefined || this.dirpath == null)
		{
				this.dirpath = "";
		}  	
		
		this.dirpathorig = this.dirpath;
		
		this.daemonpath = this.globalService.container.get('daemonpath');
		
		if(this.daemonpath == undefined || this.daemonpath == null)
		{
				this.daemonpath = "";
		}  	
		
		this.daemonpathorig = this.daemonpath;		
			
        this.rundaemon =  this.globalService.container.get('rundaemon');
			
		if( this.rundaemon == undefined ||  this.rundaemon == null)
		{
				 this.rundaemon = true;
		}  	


        this.testnet =  this.globalService.container.get('testnet');
			
		if( this.testnet == undefined ||  this.testnet == null)
		{
				 this.testnet = false;
		}  		
		
		this.currentTestnet = this.testnet;

	}
	
	selectDaemonBtnClick()
	{
        window.require('electron').remote.dialog.showOpenDialog({title: this.translate.instant('SSETTINGS.DAEMONDIST'),  properties: ['openDirectory']}, (filePath) => {
			
			if (filePath === undefined)
			{
				swal(this.translate.instant('SOVERVIEW.ERROR'), this.translate.instant('SSETTINGS.SELPATH'), "error");
				return;
			}	

			
			this.daemonpath = filePath;
			this.cdr.detectChanges();
		
		});		
	}
	
	useDefaultClick()
	{
		this.defaultClass = "selected";
		this.advancedClass  = "";
		this.usedefault = true;			
	}
	
	useAdvancedClick()
	{
		this.defaultClass = "";
		this.advancedClass  = "selected";
		this.usedefault = false;			
	}
	
	selectPathBtnClick()
	{
        window.require('electron').remote.dialog.showOpenDialog({title: this.translate.instant('SSETTINGS.SEDDDARIPT'),  properties: ['openDirectory']}, (filePath) => {
			
			if (filePath === undefined)
			{
				swal(this.translate.instant('SOVERVIEW.ERROR'), this.translate.instant('SSETTINGS.SELPATH'), "error");
				return;
			}	

			this.clearPathShedule = false;
			this.dirpath = filePath;
			this.cdr.detectChanges();
		
		});
		
	}
	
	clearPathBtnClick()
	{
		this.clearPathShedule = true;
		this.dirpath = "";
	}
	
	backUpWallet(type)
	{
		if(type == 0)
		{
			window.require('electron').remote.dialog.showSaveDialog({title: this.translate.instant('SSETTINGS.SELBUDIST'), defaultPath: '~/vault.dat',  filters: [{name: 'Wallet Data', extensions: ['dat']}]}, (filePath) => {

			if (filePath === undefined)
			{
				swal(this.translate.instant('SOVERVIEW.ERROR'), this.translate.instant('SSETTINGS.NOFILESEL'), "error");
				return;
			}
				
				
			this.globalService.walletBackUp(filePath, type);
			
			});	
		}
		else
		{
			window.require('electron').remote.dialog.showSaveDialog({title: this.translate.instant('SSETTINGS.SELBUDIST'), defaultPath: '~/game.dat',  filters: [{name: 'Wallet Data', extensions: ['dat']}]}, (filePath) => {

			if (filePath === undefined)
			{
				swal(this.translate.instant('SOVERVIEW.ERROR'), this.translate.instant('SSETTINGS.NOFILESEL'), "error");
				return;
			}
				
				
			
			this.globalService.walletBackUp(filePath, type);
			
			});				
		}	
	}
	
	getCurrentWalletType()
	{
		return this.globalService.getWalletTypeName();
	}

    updateSettingsDetails()
	{
		
		let _that = this;
		
		if(this.usedefault == true)
		{
			this.port =  this.globalService.getDefaultPort();
			this.host = "127.0.0.1";
			this.username = "";
			this.password = "";
			this.daemonpath = "";
			this.rundaemon = true;
			this.dirpath = "";
		}
		
		if(this.currentTestnet != this.testnet)
		{
			if(this.testnet == true)
			{
				this.port = 18396;
			}
			else
			{
				this.port = 8396;
			}
		}
		
		this.globalService.container.set('host', this.host);
		this.globalService.container.set('port', this.port);
		this.globalService.container.set('username', this.username);
		this.globalService.container.set('password', this.password);
		this.globalService.container.set('dirpath', this.dirpath);
		this.globalService.container.set('daemonpath', this.daemonpath);
		this.globalService.container.set('usedefault', this.usedefault);
		this.globalService.container.set('rundaemon', this.rundaemon);
		this.globalService.container.set('testnet', this.testnet);
		
			
			
		//We must erase on empty, or bat file will load from file
		if(this.dirpath != this.dirpathorig)
		{
			if(this.dirpath == "")
			{
				this.clearPathShedule = true;
			}
		}		
		
		
		if(this.clearPathShedule)
		{
			const path = window.require('path');
	        let basepath = window.require('electron').remote.app.getPath('appData');
            let filename = path.join(basepath, './Xaya/appdata.orv');
	        const fs = window.require('fs');
			
			try { fs.unlinkSync(filename); }
			catch(e) { swal(this.translate.instant('SOVERVIEW.ERROR'), this.translate.instant('SSETTINGS.FAILSAVE'), "error"); }		
		}
		

		
		let normalWarningType = true;
		
        //Additionally to electron storage, we need to create this file
		//Because our 'chim.bat' file needs to read new path from somewhere
		//outside the original eelctron app, which is packed inside asar
		//appdata.orvald is used only by the 'chim.bat' and nowhere else
		if(this.dirpath != "")
		{
			const path = window.require('path');
	        let basepath = window.require('electron').remote.app.getPath('appData');
            let filename = path.join(basepath, './Xaya/appdata.orv');
	        const fs = window.require('fs');	


		    try { fs.writeFileSync(filename, this.dirpath, 'utf-8'); }
			catch(e) { swal(this.translate.instant('SOVERVIEW.ERROR'), this.translate.instant('SSETTINGS.FAILSAVE'), "error"); }				

			
		}		
		
		
		
		
		
		if(this.dirpath != this.dirpathorig || this.daemonpath != this.daemonpathorig )
		{
			normalWarningType = false;
	
		}
		
		if(this.currentTestnet != this.testnet)
		{
			normalWarningType = false;
		}
		
		if(this.usernameOrig != this.username)
		{
			normalWarningType = false;
		}		
		
		if(this.passwordOrig != this.password)
		{
			normalWarningType = false;
		}		
		
		if(normalWarningType)
		{
		   swal(this.translate.instant('SOVERVIEW.SUCCESS'), this.translate.instant('SSETTINGS.SETTINGSSAVED'), "success");
		   this.globalService.reconnectTheClient();
		}
		else
		{

			swal({
			  title: this.translate.instant('SSETTINGS.NEEDRESTART'),
			  confirmButtonText: this.translate.instant('SSEND.CONFIRM3'),
			  type: 'info',
			  showCancelButton: false,
			}).then((result) => 
			{
				if(result.value)
				{
				    _that.globalService.shutDown();
				}
			})		   
		   	  
		}
		
		this.dirpathorig = this.dirpath;
		this.currentTestnet = this.testnet;
	}
	
}
