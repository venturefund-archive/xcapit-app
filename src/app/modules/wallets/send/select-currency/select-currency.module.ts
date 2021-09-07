import { NgModule } from '@angular/core';
import { SelectCurrencyPageRoutingModule } from './select-currency-routing.module';
import { SelectCurrencyPage } from './select-currency.page';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';

@NgModule({
  imports: [SelectCurrencyPageRoutingModule, SharedWalletsModule],
  declarations: [SelectCurrencyPage],
})
export class SelectCurrencyPageModule {}
