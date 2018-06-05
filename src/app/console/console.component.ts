import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { GlobalService } from '../service/global.service';


declare var $:any;
declare var swal:any;



@Component({
  selector: 'console-cmp',
  templateUrl: './console.component.html'
})


export class ConsoleComponent  {


	public command:string = "";
	private consoleTextHolder:string = "";
	public consoleText:string = "";
    public carretOn:boolean = false;
	public viewDebugON:boolean = false;
	
	constructor(private globalService:GlobalService, private cdr: ChangeDetectorRef) 
	{
		
	}
	
	
	onKeydown(event) {
	  if (event.key === "Enter") {
		this.sendConsoleCommand();
	  }
	}
	
    toggleDebugLog()
	{
		this.viewDebugON = !this.viewDebugON;
		let _that = this;
		if(this.viewDebugON)
		{
				var userAgent = navigator.userAgent.toLowerCase();
				if (userAgent.indexOf(' electron/') == -1) 
				{
				   return;
				}	  
	  
	  

				const path = window.require('path');
				let basepath = window.require('electron').remote.app.getPath('appData');
				let filename = path.join(basepath, './Chimaera/debug.log');
				const fs = window.require('fs');
				

				
				if (fs.existsSync(filename)) 
				{
				}
				else
				{
					 filename = path.join(basepath, './Chimaera/testnet/debug.log');
					
					if (!fs.existsSync(filename)) 
					{
						return;
					}
					
				}
				
				
				let contents = "";
				fs.readFile(filename, 'utf8', function(err, data) 
				{
					if (err) throw err;
					contents = data;
					_that.consoleText = contents;
					 _that.cdr.detectChanges();
					
				});  
				
					
		}
		else
		{
			
          this.consoleText = this.consoleTextHolder;
		  this.cdr.detectChanges();
			
		}
		
	}
	

	async sendConsoleCommand()
	{
		let cmd = this.command;
		
		let result = await this.globalService.consoleCommand(cmd);
		let str = JSON.stringify(result, null, 2);
		
		this.consoleTextHolder += cmd;
		this.consoleTextHolder += "\n";;
		this.consoleTextHolder += result;
		this.consoleTextHolder += "\n\n";
		
		this.consoleText = this.consoleTextHolder;
		this.consoleText =  this.consoleText.replace(/\\n/g, String.fromCharCode(13, 10));
		
		this.command = "";
		this.cdr.detectChanges();
	}

}
