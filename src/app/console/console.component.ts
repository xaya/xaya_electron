import { Component, OnInit, OnDestroy  } from '@angular/core';
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
	
	constructor(private globalService:GlobalService) 
	{
		
	 let _that = this;		
     setInterval(function(){ _that.carretBlink(); }, 600);
  
	}
	
	
	onKeydown(event) {
	  if (event.key === "Enter") {
		this.sendConsoleCommand();
	  }
	}
	
	
	carretBlink()
	{
		if(!this.carretOn)
		{
			this.consoleText = this.consoleTextHolder + "_";
		}
		else
		{
			this.consoleText = this.consoleTextHolder;
		}
		
		this.carretOn = !this.carretOn;
	}
	
	async sendConsoleCommand()
	{
		var cmd = this.command;
		this.command = "";
		var result = await this.globalService.consoleCommand(cmd);
		
		
		this.consoleTextHolder += result;
		this.consoleTextHolder += "\n";
		
		this.consoleText = this.consoleTextHolder;
		
		
	}

}
