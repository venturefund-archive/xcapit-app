import { NgModule } from '@angular/core';
import { WalletPrivacyPage } from './wallet-privacy.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';
const routes: Routes = [
  {
    path: '',
    component: WalletPrivacyPage,
  },
];
@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  declarations: [WalletPrivacyPage],
})
export class WalletPrivacyPageModule {}
