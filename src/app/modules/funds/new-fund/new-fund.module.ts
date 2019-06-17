import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewFundPage } from './new-fund.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';
import { SharedTutorialsModule } from '../../tutorials/shared-tutorials/shared-tutorials.module';

const routes: Routes = [
  {
    path: '',
    component: NewFundPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    SharedTutorialsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewFundPage]
})
export class NewFundPageModule {}
