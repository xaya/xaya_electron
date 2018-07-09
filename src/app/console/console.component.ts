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
				let filename;
				
				
				let testnet =  this.globalService.container.get('testnet');
				if(testnet == undefined ||  testnet == null)
				{
						 testnet = true; //TODO - change after wallet goes life to false
				} 					
				
				if(testnet == true)
				{
				   filename = path.join(basepath, './Xaya/testnet/debug.log');
				}
				else
				{
				   filename = path.join(basepath, './Xaya/debug.log');
				}
				
				
				const fs = window.require('fs');
				

				

				
				
				let contents = "Loding...";
				_that.consoleText = contents;
			    _that.cdr.detectChanges();
					 
				
				fs.readFile(filename, 'utf8', function(err, data) 
				{
					if (err) throw err;
					contents = data;
					
					if(contents.length > 10000)
					{
					contents = "........." + contents.substr(contents.length - 10000, 10000);
					}
					
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
		cmd = cmd.trim();
		console.log(cmd);
		let result = await this.globalService.consoleCommand(cmd);
		
		
		if(result.toString().includes("[object Object]"))
		{
			 result = JSON.stringify(result, undefined, 2);
		}
		else
		{
		}
		
		
		
		this.consoleTextHolder += cmd;
		this.consoleTextHolder += "\n";;
		this.consoleTextHolder += result;
		this.consoleTextHolder += "\n\n";
		
		this.consoleText = this.consoleTextHolder;
		
		this.command = "";
		this.cdr.detectChanges();
		
        setTimeout(function() 
		{				
		     var textarea = document.getElementById('controlformid');
             textarea.scrollTop = textarea.scrollHeight;
			 
		}, 300);			
		
	
		
	}

}
