import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { GlobalService } from '../service/global.service';


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
	
	public defaultClass: string = "";
	public advancedClass: string = "";
	
	constructor(private globalService:GlobalService, private cdr: ChangeDetectorRef) 
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
		
		this.port =  this.globalService.container.get('port');
			
		if(this.port == undefined || this.port == null)
		{
				this.port = 8396;
		}  	
		
		
 		this.username =  this.globalService.container.get('username');
			
		if( this.username == undefined ||  this.username == null)
		{
				 this.username = "";
		}  
		
		this.password =  this.globalService.container.get('password');
			
		if(this.password == undefined || this.password == null)
		{
				this.password = "";
		}  	 
		
		
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
			
	
		

	}
	
	selectDaemonBtnClick()
	{
        window.require('electron').remote.dialog.showOpenDialog({title: 'Select daemon destination',  properties: ['openDirectory']}, (filePath) => {
			
			if (filePath === undefined)
			{
				swal("Error", "You didn't select a path", "error");
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
        window.require('electron').remote.dialog.showOpenDialog({title: 'Select datadir destination',  properties: ['openDirectory']}, (filePath) => {
			
			if (filePath === undefined)
			{
				swal("Error", "You didn't select a path", "error");
				return;
			}	

			this.dirpath = filePath;
			this.cdr.detectChanges();
		
		});
		
	}
	
	backUpWallet()
	{
		window.require('electron').remote.dialog.showOpenDialog({title: 'Select backup destination', filters: [{name: 'Wallet Data', extensions: ['dat']}],  properties: ['promptToCreate']}, (filePath) => {
			
		if (filePath === undefined)
		{
			swal("Error", "You didn't select a file", "error");
			return;
		}
			
			
		this.globalService.walletBackUp(filePath[0]);
		
		});		
	}

    updateSettingsDetails()
	{
		this.globalService.container.set('host', this.host);
		this.globalService.container.set('port', this.port);
		this.globalService.container.set('username', this.username);
		this.globalService.container.set('password', this.password);
		this.globalService.container.set('dirpath', this.dirpath);
		this.globalService.container.set('daemonpath', this.daemonpath);
		this.globalService.container.set('usedefault', this.usedefault);
		
		console.log("setting dirpath: " + this.dirpath)
		
		let normalWarningType = true;
		
        //Additionally to electron storage, we need to create this file
		//Because our 'chim.bat' file needs to read new path from somewhere
		//outside the original eelctron app, which is packed inside asar
		//appdata.orvald is used only by the 'chim.bat' and nowhere else
		if(this.dirpath != "")
		{
			const path = window.require('path');
	        let basepath = window.require('electron').remote.app.getPath('appData');
            let filename = path.join(basepath, './Chimaera/appdata.orvald');
	        const fs = window.require('fs');	


		    try { fs.writeFileSync(filename, this.dirpath, 'utf-8'); }
			catch(e) { swal("Error", 'Failed to save the file !', "error"); }				

			
		}		
		
		
		
		this.globalService.reconnectTheClient();
		
		if(this.dirpath != this.dirpathorig || this.daemonpath != this.daemonpathorig )
		{
			normalWarningType = false;
		}
		
		if(normalWarningType)
		{
		   swal("Success", "Settings Saved", "success")
		}
		else
		{
		   swal("Success", "Settings Saved, you need to restart Wallet now", "success")	
		}
		
	}
	
}
