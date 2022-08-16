import { NgModule } from '@angular/core';
import { OnBoardingPage } from './on-boarding.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedUsersModule } from '../shared-users/shared-users.module';
import { SwiperModule } from 'swiper/angular';

const routes: Routes = [
  {
    path: '',
    component: OnBoardingPage,
  },
];

@NgModule({
  imports: [SwiperModule, SharedUsersModule, RouterModule.forChild(routes)],
  declarations: [OnBoardingPage],
})
export class OnBoardingPageModule {}
