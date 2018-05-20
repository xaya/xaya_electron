import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesnavbarComponent } from './pagesnavbar.component';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
      RouterModule,
      CommonModule
  ],
  declarations: [PagesnavbarComponent],
  exports: [ PagesnavbarComponent ]
})
export class PagesnavbarModule { }
