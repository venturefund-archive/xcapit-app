import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [SharedModule],
  exports: [SharedModule],
  providers: [DatePipe],
})
export class SharedReferralsModule { }
