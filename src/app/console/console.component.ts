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
	public consoleText:string = "";
 
	constructor(private globalService:GlobalService) 
	{

  
	}
	
	
	onKeydown(event) {
	  if (event.key === "Enter") {
		this.sendConsoleCommand();
	  }
	}
	
	async sendConsoleCommand()
	{
		var cmd = this.command;
		this.command = "";
		var result = await this.globalService.consoleCommand(cmd);
		
		
		this.consoleText += result;
		this.consoleText += "\n";
		
		
	}

}
