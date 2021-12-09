import { NgModule } from '@angular/core';
import { AboutInvestorProfilesPage } from './about-investor-profiles.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWealthManagementsModule } from '../shared-wealth-managements/shared-wealth-managements.module';
import { InvestorProfileStepComponent } from '../shared-wealth-managements/components/investor-profile-step/investor-profile-step.component';
import { SwiperModule } from 'swiper/angular';
const routes: Routes = [
  {
    path: '',
    component: AboutInvestorProfilesPage,
  },
];
@NgModule({
  imports: [SharedWealthManagementsModule, RouterModule.forChild(routes), SwiperModule],
  declarations: [AboutInvestorProfilesPage, InvestorProfileStepComponent],
})
export class AboutInvestorProfilesPageModule {}
