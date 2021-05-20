import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatePipe } from '@angular/common';
import { HideReferralPipe } from 'src/app/shared/pipes/hide-referral/hide-referral.pipe';

@NgModule({
  declarations: [],
  imports: [SharedModule],
  exports: [SharedModule],
  providers: [DatePipe, HideReferralPipe],
})
export class SharedReferralsModule { }
