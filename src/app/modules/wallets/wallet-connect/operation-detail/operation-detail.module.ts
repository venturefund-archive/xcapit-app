import { NgModule } from '@angular/core';
import { OperationDetailPage } from './operation-detail.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';
import { SignRequestComponent } from './components/sign-request/sign-request.component';
import { DefaultRequestComponent } from './components/default-request/default-request.component';
import { SwapRequestComponent } from './components/swap-request/swap-request.component';
import { LiquidityRequestComponent } from './components/liquidity-request/liquidity-request.component';

const routes: Routes = [
  {
    path: '',
    component: OperationDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [
    OperationDetailPage,
    SignRequestComponent,
    DefaultRequestComponent,
    SwapRequestComponent,
    LiquidityRequestComponent
  ],
})
export class OperationDetailPageModule {}
