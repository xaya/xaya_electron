import { Component, OnInit, OnDestroy  } from '@angular/core';
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


	constructor(private globalService:GlobalService) 
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
  

	}
	
	backUpWallet()
	{
		window.require('electron').remote.dialog.showOpenDialog({title: 'Select backup destination', filters: [{name: 'Wallet Data', extensions: ['dat']}],  properties: ['promptToCreate']}, (filePath) => {
			
		if (filePath === undefined)
		{
			swal("Error", "You didn't select a file", "error");
			return;
		}
			
			
		this.globalService.walletBackUp(filePath);
		
		});		
	}

    updateSettingsDetails()
	{
		this.globalService.container.set('host', this.host);
		this.globalService.container.set('port', this.port);
		this.globalService.reconnectTheClient();
		swal("Success", "Settings Saved", "success")
		
	}
	
}
