import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundsListPage } from './funds-list.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';
import { FundListSubHeaderComponent } from './components/fund-list-sub-header/fund-list-sub-header.component';
import { FundSliderNewsCardComponent } from './components/fund-slider-news/fund-slider-news.component';

const routes: Routes = [
  {
    path: '',
    component: FundsListPage,
  },
];

@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [
    FundsListPage,
    FundListSubHeaderComponent,
    FundSliderNewsCardComponent,
  ],
})
export class FundsListPageModule {}
