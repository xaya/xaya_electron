import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { PersistenceService } from 'angular-persistence';
import {TranslateService} from '@ngx-translate/core';
import { StorageType } from 'angular-persistence';
import { GlobalService } from '../service/global.service';
import { IPersistenceContainer } from 'angular-persistence';

declare var $:any;
declare var swal:any;

declare interface AddressTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}


@Component({
  selector: 'addresses-cmp',
  templateUrl: './addresses.component.html'
})


export class AddressesComponent implements OnInit {

     public dataTable: AddressTable;
	 public dataTable2: AddressTable;
	 
	 public address: string = "";
	 public aLabel: string = "";
     public aLabel2: string = "";
	 
     private container: IPersistenceContainer;
 
	constructor(private translate: TranslateService, public persistenceService: PersistenceService, private globalService:GlobalService) 
	{

        this.container = persistenceService.createContainer(
            'org.CHIMAERA.global',
            {type: StorageType.LOCAL, timeout: 220752000000}
        );	
	
        translate.setDefaultLang('en');
 
		var lang =  this.container.get('lang');
		
		if(lang == undefined || lang == null)
		{
			lang = "en";
		}
		
        translate.use(lang).subscribe(() => 
		{
           this.initContinue();
      }, err => 
	  {
			swal("Error", "Failed to init language", "error")
			return;
      }, () => {
        
      });		

		
		

		
	}

	ngOnDestroy()
	{
	
	}
	
	async insertReceivingAddress()
	{
		if(this.aLabel2.length < 2)
		{
			swal("Error", this.translate.instant('SADDRESSES.PLEASEFILLTHELABLE'), "error")
			return;
		}		
		
		var value = await this.globalService.insertReceivingAddress(this.aLabel2);
		
	    if(value.length < 2 || value == undefined)
		{
			swal("Error", this.translate.instant('SADDRESSES.ADDRESSNOTVALID'), "error")
			return;		
		}
		else
		{
			var objArr = this.getRAddresses();
			
			var entry = [value, this.aLabel2];
			objArr.push(entry);
			
			this.container.set('receiveaddresses', JSON.stringify(objArr));
			
			
            this.dataTable2 =
			{
            headerRow: [ this.translate.instant('SADDRESSES.ADDRESS'), this.translate.instant('SADDRESSES.LABEL')],
            footerRow: [  this.translate.instant('SADDRESSES.ADDRESS'), this.translate.instant('SADDRESSES.LABEL')],
            dataRows: objArr
            };			
			
		}	
	}
	
	async insertSendingAddress()
	{
		if(this.address.length < 2)
		{
			swal("Error", this.translate.instant('SADDRESSES.FILLTHEADDRESS'), "error")
			return;
		}
		
		if(this.aLabel.length < 2)
		{
			swal("Error", this.translate.instant('SADDRESSES.PLEASEFILLTHELABLE'), "error")
			return;
		}		
		
		var value = await this.globalService.insertSendingAddress(this.address, this.aLabel);
		
		
		if(value == false)
		{
			swal("Error", this.translate.instant('SADDRESSES.ADDRESSNOTVALID'), "error")
			return;		
		}
		else
		{
			var objArr = this.getSAddresses();
			
			var entry = [this.address, this.aLabel];
			objArr.push(entry);
			
			this.container.set('sendaddresses', JSON.stringify(objArr));
			
			
            this.dataTable =
			{
            headerRow: [ this.translate.instant('SADDRESSES.ADDRESS'), this.translate.instant('SADDRESSES.LABEL')],
            footerRow: [ this.translate.instant('SADDRESSES.ADDRESS'), this.translate.instant('SADDRESSES.LABEL')],
            dataRows: objArr
            };			
			
		}
		
		

		
	}
	
	getSAddresses()
	{
	    var saddresses =  this.container.get('sendaddresses');
	    var objArr;	
		
		if(saddresses == undefined || saddresses == null)
		{
			objArr = [];
		}
		else
		{
			objArr = JSON.parse(saddresses);
		}	
		
		return objArr;
	}
	
	getRAddresses()
	{
	    var saddresses =  this.container.get('receiveaddresses');
	    var objArr;	
		
		if(saddresses == undefined || saddresses == null)
		{
			objArr = [];
		}
		else
		{
			objArr = JSON.parse(saddresses);
		}	
		
		return objArr;
	}	
	
	
	reInitDataTable()
	{
         var table = $('#datatables').DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            responsive: true,
            language: {
            search: "_INPUT_",
            searchPlaceholder: this.translate.instant('SADDRESSES.SEARCHADDRESSES'),
            }

        });

        var _that =this;
        // Delete a record
        table.on( 'click', '.remove', function (e) 
		{
			
            var sLabel =  $(this).attr('data-sectionvalue');
			
            var saddresses =  _that.container.get('sendaddresses');
			var objArr = _that.getSAddresses();
			
			for(var d = 0; d < objArr.length;d++)
			{
				if(objArr[d][1] == sLabel)
				{
					objArr.splice(d, 1);
					break;
				}
			}
			
            _that.dataTable =
			{
            headerRow: [ _that.translate.instant('SADDRESSES.ADDRESS'), _that.translate.instant('SADDRESSES.LABEL')],
            footerRow: [ _that.translate.instant('SADDRESSES.ADDRESS'), _that.translate.instant('SADDRESSES.LABEL')],
            dataRows: objArr
            };		

			
			_that.container.set('sendaddresses', JSON.stringify(objArr));
			
            e.preventDefault();
			
        } );		
	}
	
	
	reInitDataTable2()
	{
         var table = $('#datatables2').DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            responsive: true,
            language: {
            search: "_INPUT_",
            searchPlaceholder: this.translate.instant('SADDRESSES.SEARCHADDRESSES'),
            }

        });

        var _that =this;
        // Delete a record
        table.on( 'click', '.remove', function (e) 
		{
			
            var sLabel =  $(this).attr('data-sectionvalue');
			
            var saddresses =  _that.container.get('receiveaddresses');
			var objArr = _that.getRAddresses();
			
			for(var d = 0; d < objArr.length;d++)
			{
				if(objArr[d][1] == sLabel)
				{
					objArr.splice(d, 1);
					break;
				}
			}
			
            _that.dataTable2 =
			{
            headerRow: [ _that.translate.instant('SADDRESSES.ADDRESS'), _that.translate.instant('SADDRESSES.LABEL')],
            footerRow: [ _that.translate.instant('SADDRESSES.ADDRESS'), _that.translate.instant('SADDRESSES.LABEL')],
            dataRows: objArr
            };		

			
			_that.container.set('receiveaddresses', JSON.stringify(objArr));
			
            e.preventDefault();
			
        } );		
	}	
	
    ngAfterViewInit()
    {

    }	
	
	initContinue()
	{
		var objArr = this.getSAddresses();
		this.dataTable =
		{
		headerRow: [ this.translate.instant('SADDRESSES.ADDRESS'), this.translate.instant('SADDRESSES.LABEL')],
		footerRow: [ this.translate.instant('SADDRESSES.ADDRESS'), this.translate.instant('SADDRESSES.LABEL')],
		dataRows:   objArr
		};		
		
		var objArr2 = this.getRAddresses();
		this.dataTable2 =
		{
		headerRow: [ this.translate.instant('SADDRESSES.ADDRESS'), this.translate.instant('SADDRESSES.LABEL')],
		footerRow: [ this.translate.instant('SADDRESSES.ADDRESS'), this.translate.instant('SADDRESSES.LABEL')],
		dataRows:   objArr2
		};			
		
		
        this.reInitDataTable();
		this.reInitDataTable2();		
		
	}
	
    ngOnInit()
	{ 
	
		var objArr = this.getSAddresses();
		this.dataTable =
		{
		headerRow: [ '', ''],
		footerRow: [ '', ''],
		dataRows:  []
		};		
		
		var objArr2 = this.getRAddresses();
		this.dataTable2 =
		{
		headerRow: [ '', ''],
		footerRow: [ '', ''],
		dataRows:   []
		};			

    }
}
