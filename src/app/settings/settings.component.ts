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
	
	constructor(private globalService:GlobalService, private cdr: ChangeDetectorRef) 
	{

		this.host =  this.globalService.container.get('host');
			
		if( this.host == undefined ||  this.host == null)
		{
				 this.host = "127.0.0.1";
		}  
		
		this.port =  this.globalService.container.get('port');
			
		if(this.port == undefined || this.port == null)
		{
				this.port = 10133;
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
		
		
		const path = window.require('path');
	    let basepath = window.require('electron').remote.app.getPath('appData');
        let filename = path.join(basepath, './Chimaera/appdata.orvald');
	    const fs = window.require('fs');

		let _that = this;
		if (fs.existsSync(filename)) 
	    {
				fs.readFile(filename, 'utf8', function(err, data) 
				{
					if (err) throw err;
					_that.dirpath = data;
					_that.dirpathorig = data;
				});  	
	    }		

	}
	
	selectPathBtnClick()
	{
        window.require('electron').remote.dialog.showOpenDialog({title: 'Select backup destination',  properties: ['openDirectory']}, (filePath) => {
			
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
		
		let normalWarningType = true;
		
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
		
		if(this.dirpath != this.dirpathorig)
		{
			normalWarningType = false;
		}
		
		if(normalWarningType)
		{
		   swal("Success", "Settings Saved", "success")
		}
		else
		{
		   swal("Success", "Settings Saved, restart whole wallet to use new datadir path", "success")	
		}
		
	}
	
}
