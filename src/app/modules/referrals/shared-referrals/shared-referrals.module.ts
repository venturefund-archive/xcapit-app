import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatePipe } from '@angular/common';
import { ReferralsShareComponent } from './components/referrals-share/referrals-share.component';
import { ReferralsPendingComponent } from './components/referrals-pending/referrals-pending.component';
import { ReferralsHistoryComponent } from './components/referrals-history/referrals-history.component';
import { ReferralDetailComponent } from './components/referral-detail/referral-detail.component';
import { ReferralPromotionCardComponent } from './components/referral-promotion-card/referral-promotion-card.component';
import { HideEmailPipe } from 'src/app/shared/pipes/hide-email/hide-email.pipe';

@NgModule({
  declarations: [
    ReferralsShareComponent,
    ReferralsPendingComponent,
    ReferralsHistoryComponent,
    ReferralDetailComponent,
    ReferralPromotionCardComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    ReferralsShareComponent,
    ReferralsPendingComponent,
    ReferralsHistoryComponent,
    ReferralDetailComponent,
    ReferralPromotionCardComponent,
  ],
  providers: [DatePipe, HideEmailPipe],
})
export class SharedReferralsModule {}
