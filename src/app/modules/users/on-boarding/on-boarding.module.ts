import { NgModule } from '@angular/core';
import { OnBoardingPage } from './on-boarding.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedUsersModule } from '../shared-users/shared-users.module';
import { SwiperModule } from 'swiper/angular';
import { NoWallet } from '../../../shared/guards/no-wallet/no-wallet.service';
import { NoAuthNewGuard } from '../shared-users/guards/no-auth-new/no-auth-new.guard';

const routes: Routes = [
  {
    canActivate: [NoWallet, NoAuthNewGuard],
    path: '',
    component: OnBoardingPage,
  },
];

@NgModule({
  imports: [SwiperModule, SharedUsersModule, RouterModule.forChild(routes)],
  declarations: [OnBoardingPage],
})
export class OnBoardingPageModule {}
