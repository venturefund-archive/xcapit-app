import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OnBoardingPage } from './on-boarding.page';
import { RouterModule, Routes } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: OnBoardingPage,
  },
];

@NgModule({
  imports: [SharedModule, CommonModule, FormsModule, IonicModule, SwiperModule, RouterModule.forChild(routes)],
  declarations: [OnBoardingPage],
})
export class OnBoardingPageModule {}
