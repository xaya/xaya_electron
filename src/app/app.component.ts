import { Component, OnDestroy} from '@angular/core';
import { GlobalService } from './service/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy 
{

    constructor(private globalService:GlobalService)
	{

        
    }		
	
	



  ngOnDestroy() 
  {
	  
	  this.globalService.client.stop().then(
		  (help) =>  
		  {


		  }
	  ).catch(function(e) {


			 
	  });	
	  
  }

}
