import { NgModule } from '@angular/core';
import { FundSettingsPage } from './fund-settings.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: FundSettingsPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundSettingsPage]
})
export class FundSettingsPageModule {}
