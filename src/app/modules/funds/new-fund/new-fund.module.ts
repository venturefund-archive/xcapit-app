import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewFundPage } from './new-fund.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';
import { SharedTutorialsModule } from '../../tutorials/shared-tutorials/shared-tutorials.module';
import { FundActionFormTitlePipe } from './pipes/fund-action-form-title/fund-action-form-title.pipe';
import { FundActionFormTextButtonPipe } from './pipes/fund-action-form-text-button/fund-action-form-text-button.pipe';

const routes: Routes = [
  {
    path: ':action/:fundName',
    component: NewFundPage
  },
  {
    path: ':action',
    component: NewFundPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    SharedTutorialsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewFundPage, FundActionFormTitlePipe, FundActionFormTextButtonPipe]
})
export class NewFundPageModule {}
