import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FixedFooterComponent } from './components/fixed-footer/fixed-footer/fixed-footer.component';
import { ProviderNewOperationCardComponent } from './components/provider-new-operation-card/provider-new-operation-card/provider-new-operation-card.component';
import { TransferConfirmCardComponent } from './components/transfer-confirm-card/transfer-confirm-card.component';
import { KycDisclaimerModalComponent } from './components/kyc-disclaimer-modal/kyc-disclaimer-modal.component';

@NgModule({
  declarations: [
    FixedFooterComponent,
    TransferConfirmCardComponent,
    ProviderNewOperationCardComponent,
    KycDisclaimerModalComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    FixedFooterComponent,
    TransferConfirmCardComponent,
    ProviderNewOperationCardComponent,
    KycDisclaimerModalComponent,
  ],
})
export class SharedRampsModule {}
