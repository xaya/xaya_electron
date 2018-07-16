import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  test : Date = new Date();
  public debugLogText:string  = "";
  constructor(private cdr: ChangeDetectorRef) 
  { 
  
   let _that = this;
 	window.onerror = function(error, url, line) 
	{
		_that.debugLogText  = error;
	    _that.cdr.detectChanges();
	};   
  
  }

  ngOnInit() 
  {
	  
	
   const originalConsoleLog = console.log.bind(console);
   console.log = (args) => 
   {
	 
	 let stringArr = args.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
	 
	 this.debugLogText  = "";
	 
	 
	 for(let i = stringArr.length - 1; i >= 0; i--)
	 {
		 this.debugLogText += stringArr[i] + "\n";
	 }
	   
	 this.cdr.detectChanges();
   }	


  }

}
