import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FixedFooterComponent } from './components/fixed-footer/fixed-footer/fixed-footer.component';
import { OperationsListAccordionComponent } from './components/operations-list-accordion/operations-list-accordion.component';
import { OperationsListComponent } from './components/operations-list/operations-list.component';
import { OperationsListItemComponent } from './components/operations-list-item/operations-list-item.component';
import { OperationStatusChipComponent } from './components/operation-status-chip/operation-status-chip.component';
import { TransferConfirmCardComponent } from './components/transfer-confirm-card/transfer-confirm-card.component';
import { ProviderNewOperationCardComponent } from './components/provider-new-operation-card/provider-new-operation-card/provider-new-operation-card.component';
import { FiatInputComponent } from './components/fiat-input/fiat-input.component';
import { InfoProviderComponent } from './components/info-provider/info-provider.component';
import { CoinSelectorModalComponent } from './components/coin-selector-modal/coin-selector-modal.component';
import { SkipTransactionVoucherComponent } from './components/skip-transaction-voucher/skip-transaction-voucher.component';
import { FeeInfoModalComponent } from './components/fee-info-modal/fee-info-modal.component';
import { UserRegisterStepCardComponent } from './components/user-register-step-card/user-register-step-card.component';
import { InfoProviderKriptonComponent } from './components/info-provider-kripton/info-provider-kripton.component';
import { InfoProviderMoonpayComponent } from './components/info-provider-moonpay/info-provider-moonpay.component';
import { ValidationContentComponent } from './components/validation-content/validation-content.component';
import { ConfirmationContentComponent } from './components/confirmation-content/confirmation-content.component';
import { BuyOrDepositTokenToastComponent } from './components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { UserRegisterContentComponent } from './components/user-register-content/user-register-content/user-register-content.component';
import { KriptonAccountInfoCardComponent } from './components/kripton-account-info-card/kripton-account-info-card.component';
import { KriptonPurchaseInfoComponent } from './components/kripton-purchase-info/kripton-purchase-info.component';
import { TimerCountdownComponent } from './components/timer-countdown/timer-countdown.component';
import { MoonpayPurchasesCardComponent } from './components/moonpay-purchases-card/moonpay-purchases-card/moonpay-purchases-card.component';
import { UserBasicInformationComponent } from './components/user-basic-information/user-basic-information.component';
import { UserPersonalInformationComponent } from './components/user-personal-information/user-personal-information.component';
import { UserAddressInformationComponent } from './components/user-address-information/user-address-information.component';
import { OperationKmInProgressModalComponent } from './components/operation-km-in-progress-modal/operation-km-in-progress-modal.component';
import { OperationStatusAlertComponent } from './components/operation-status-alert/operation-status-alert.component';

@NgModule({
  declarations: [
    FixedFooterComponent,
    TransferConfirmCardComponent,
    ProviderNewOperationCardComponent,
    OperationsListComponent,
    OperationStatusChipComponent,
    OperationsListAccordionComponent,
    OperationsListItemComponent,
    FiatInputComponent,
    InfoProviderComponent,
    CoinSelectorModalComponent,
    FeeInfoModalComponent,
    SkipTransactionVoucherComponent,
    UserRegisterStepCardComponent,
    InfoProviderKriptonComponent,
    InfoProviderMoonpayComponent,
    MoonpayPurchasesCardComponent,
    UserRegisterContentComponent,
    ValidationContentComponent,
    ConfirmationContentComponent,
    BuyOrDepositTokenToastComponent,
    KriptonAccountInfoCardComponent,
    KriptonPurchaseInfoComponent,
    TimerCountdownComponent,
    UserBasicInformationComponent,
    UserPersonalInformationComponent,
    UserAddressInformationComponent,
    BuyOrDepositTokenToastComponent,
    OperationKmInProgressModalComponent,
    OperationStatusAlertComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    FixedFooterComponent,
    TransferConfirmCardComponent,
    ProviderNewOperationCardComponent,
    OperationsListComponent,
    OperationStatusChipComponent,
    OperationsListAccordionComponent,
    OperationsListItemComponent,
    FiatInputComponent,
    InfoProviderComponent,
    CoinSelectorModalComponent,
    FeeInfoModalComponent,
    SkipTransactionVoucherComponent,
    UserRegisterStepCardComponent,
    InfoProviderKriptonComponent,
    InfoProviderMoonpayComponent,
    MoonpayPurchasesCardComponent,
    UserRegisterContentComponent,
    ValidationContentComponent,
    ConfirmationContentComponent,
    KriptonAccountInfoCardComponent,
    KriptonPurchaseInfoComponent,
    TimerCountdownComponent,
    UserBasicInformationComponent,
    UserPersonalInformationComponent,
    UserAddressInformationComponent,
    ConfirmationContentComponent,
    OperationKmInProgressModalComponent,
    OperationStatusAlertComponent,
  ],
})
export class SharedRampsModule {}
