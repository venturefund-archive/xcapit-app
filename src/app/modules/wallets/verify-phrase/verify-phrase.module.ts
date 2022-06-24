import { NgModule } from '@angular/core';
import { VerifyPhrasePage } from './verify-phrase.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { SwiperModule } from 'swiper/angular';

const routes: Routes = [
  {
    path: '',
    component: VerifyPhrasePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule, SwiperModule],
  declarations: [VerifyPhrasePage],
})
export class VerifyPhrasePageModule {}
