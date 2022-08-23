import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FixedFooterComponent } from './components/fixed-footer/fixed-footer/fixed-footer.component';
import { OperationsListAccordionComponent } from './components/operations-list-accordion/operations-list-accordion.component';
import { OperationsListComponent } from './components/operations-list/operations-list.component';
import { OperationsListItemComponent } from './components/operations-list-item/operations-list-item.component';
import { OperationStatusChipComponent } from './components/operation-status-chip/operation-status-chip.component';
import { TransferConfirmCardComponent } from './components/transfer-confirm-card/transfer-confirm-card.component';
import { ProviderNewOperationCardComponent } from './components/provider-new-operation-card/provider-new-operation-card/provider-new-operation-card.component';
import { KycDisclaimerModalComponent } from './components/kyc-disclaimer-modal/kyc-disclaimer-modal.component';
import { FiatInputComponent } from './components/fiat-input/fiat-input.component';
import { InfoProviderComponent } from './components/info-provider/info-provider.component';
import { CoinSelectorModalComponent } from './components/coin-selector-modal/coin-selector-modal.component';

@NgModule({
  declarations: [
    FixedFooterComponent,
    TransferConfirmCardComponent,
    ProviderNewOperationCardComponent,
    KycDisclaimerModalComponent,
    OperationsListComponent,
    OperationStatusChipComponent,
    OperationsListAccordionComponent,
    OperationsListItemComponent,
    FiatInputComponent,
    InfoProviderComponent,
    CoinSelectorModalComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    FixedFooterComponent,
    TransferConfirmCardComponent,
    ProviderNewOperationCardComponent,
    KycDisclaimerModalComponent,
    OperationsListComponent,
    OperationStatusChipComponent,
    OperationsListAccordionComponent,
    OperationsListItemComponent,
    FiatInputComponent,
    InfoProviderComponent,
    CoinSelectorModalComponent
  ],
})
export class SharedRampsModule {}
