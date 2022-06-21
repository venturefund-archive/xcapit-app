import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsDetailPage } from './operations-detail.page';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { VoucherCardComponent } from '../shared-ramps/components/voucher-card/voucher-card.component';
import { BankInfoCardComponent } from '../shared-ramps/components/bank-info-card/bank-info-card.component';

const routes: Routes = [
  {
    path: '',
    component: OperationsDetailPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [OperationsDetailPage, VoucherCardComponent, BankInfoCardComponent],
})
export class OperationsDetailPageModule {}
