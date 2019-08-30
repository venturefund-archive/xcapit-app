import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewFundPage } from './new-fund.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';
import { SharedTutorialsModule } from '../../tutorials/shared-tutorials/shared-tutorials.module';
import { FundActionFormTitlePipe } from './pipes/fund-action-form-title/fund-action-form-title.pipe';
import { FundActionFormTextButtonPipe } from './pipes/fund-action-form-text-button/fund-action-form-text-button.pipe';
import { NewFundInfoComponent } from './components/new-fund-info/new-fund-info.component';

const routes: Routes = [
  {
    path: ':action/:fundName',
    component: NewFundPage
  },
  {
    path: ':action',
    component: NewFundPage
  },
  {
    path: '',
    redirectTo: '/funds/list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    SharedTutorialsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    NewFundPage,
    FundActionFormTitlePipe,
    FundActionFormTextButtonPipe,
    NewFundInfoComponent
  ],
  entryComponents: [NewFundInfoComponent]
})
export class NewFundPageModule {}
