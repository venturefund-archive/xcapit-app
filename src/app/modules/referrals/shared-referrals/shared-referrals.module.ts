import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatePipe } from '@angular/common';
import { HideReferralPipe } from 'src/app/shared/pipes/hide-referral/hide-referral.pipe';
import { ReferralsShareComponent } from './components/referrals-share/referrals-share.component';
import { ReferralsPendingComponent } from './components/referrals-pending/referrals-pending.component';
import { ReferralsHistoryComponent } from './components/referrals-history/referrals-history.component';
import { ReferralDetailComponent } from './components/referral-detail/referral-detail.component';

@NgModule({
  declarations: [
    ReferralsShareComponent,
    ReferralsPendingComponent,
    ReferralsHistoryComponent,
    ReferralDetailComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    ReferralsShareComponent,
    ReferralsPendingComponent,
    ReferralsHistoryComponent,
    ReferralDetailComponent,
  ],
  providers: [DatePipe, HideReferralPipe],
})
export class SharedReferralsModule {}
