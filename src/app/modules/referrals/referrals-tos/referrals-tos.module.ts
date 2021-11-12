import { NgModule } from '@angular/core';
import { ReferralsTosPageRoutingModule } from './referrals-tos-routing.module';
import { ReferralsTosPage } from './referrals-tos.page';
import { SharedReferralsModule } from '../shared-referrals/shared-referrals.module';

@NgModule({
  imports: [SharedReferralsModule, ReferralsTosPageRoutingModule],
  declarations: [ReferralsTosPage],
})
export class ReferralsTosPageModule {}
