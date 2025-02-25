import { SplitStringPipe } from './pipes/split-string/split-string.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ErrorsFormItemComponent } from './components/errors-form-item/errors-form-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickModule } from './directives/track-click/track-click.module';
import { PercentageDisplayComponent } from './components/percentage-display/percentage-display.component';
import { XcapitLogoComponent } from './components/xcapit-logo/xcapit-logo.component';
import { UxInputComponent } from './components/ux-input/ux-input.component';
import { BinanceLogoComponent } from './components/binance-logo/binance-logo.component';
import { UxCenterImgComponent } from './components/ux-center-img/ux-center-img.component';
import { SuccessContentComponent } from './components/success-content/success-content.component';
import { UxTitleComponent } from './components/ux-title/ux-title.component';
import { UxTextComponent } from './components/ux-text/ux-text.component';
import { UxRadioGroupComponent } from './components/ux-radio-group/ux-radio-group.component';
import { UxAlertMessageComponent } from './components/ux-alert-message/ux-alert-message.component';
import { UxRangeComponent } from './components/ux-range/ux-range.component';
import { UxCardInfoRobotComponent } from './components/ux-card-info-robot/ux-card-info-robot.component';
import { UxListComponent } from './components/ux-list/ux-list.component';
import { UxSelectModalComponent } from './components/ux-select-modal/ux-select-modal.component';
import { UxInputSelectComponent } from './components/ux-input-select/ux-input-select.component';
import { LocalizedDatePipe } from './pipes/localized-date/localized-date.pipe';
import { UxLoadingBlockComponent } from './components/ux-loading-block/ux-loading-block.component';
import { UxListInvertedComponent } from './components/ux-list-inverted/ux-list-inverted.component';
import { UxCheckboxComponent } from './components/ux-checkbox/ux-checkbox.component';
import { UxTextareaComponent } from './components/ux-textarea/ux-textarea.component';
import { UxDateRangeComponent } from './components/ux-date-range/ux-date-range.component';
import { NeedHelpComponent } from './components/need-help/need-help.component';
import { ToastAlertComponent } from './components/new-toasts/toast-alert/toast-alert.component';
import { IconButtonCardComponent } from './components/icon-button-card/icon-button-card.component';
import { UxListCardComponent } from './components/ux-list-card/ux-list-card.component';
import { UxSegmentComponent } from './components/ux-segment/ux-segment.component';
import { ScanQrModalComponent } from './components/scan-qr-modal/scan-qr-modal.component';
import { UxInputUnderlinedComponent } from './components/ux-input-underlined/ux-input-underlined.component';
import { UxStepProgressBarComponent } from './components/ux-step-progress-bar/ux-step-progress-bar.component';
import { InputSelectComponent } from './components/input-select/input-select.component';
import { SelectModalNewComponent } from './components/select-modal-new/select-modal-new.component';
import { SelectStyleDirective } from './directives/select-style/select-style.directive';
import { EmbedVideoComponent } from './components/embed-video/embed-video.component';
import { SafeURLPipe } from './pipes/safe-url/safe-url.pipe';
import { SupportOptionsCardComponent } from '../modules/support/shared-support/components/support-options-card/support-options-card.component';
import { ContactSupportComponent } from '../modules/support/shared-support/components/contact-support/contact-support.component';
import { FaqComponent } from '../modules/support/shared-support/components/faq/faq.component';
import { TestOptionItemComponent } from '../modules/wealth-managements/shared-wealth-managements/components/test-option-item/test-option-item.component';
import { UxRadioItemComponent } from './components/ux-radio-item/ux-radio-item.component';
import { UxRadioItemGroupComponent } from './components/ux-radio-item-group/ux-radio-item-group.component';
import { AvatarProfileComponent } from './components/avatar-profile/avatar-profile/avatar-profile.component';
import { LoadingModalComponent } from './components/loading-modal/loading-modal.component';
import { HideTextPipe } from './pipes/hide-text/hide-text.pipe';
import { QuotesCardComponent } from './components/quotes-card/quotes-card.component';
import { ItemQuoteComponent } from './components/item-quote/item-quote.component';
import { NetworkSelectCardComponent } from '../modules/wallets/shared-wallets/components/network-select-card/network-select-card.component';
import { NoWalletComponent } from './components/no-wallet/no-wallet.component';
import { ButtonSpinnerDirective } from './directives/button-spinner/button-spinner.directive';
import { UpdateNewsComponent } from './components/update-news/update-news.component';
import { NewsItemComponent } from './components/news-item/news-item.component';
import { FeatureFlagDirective } from './directives/feature-flag/feature-flag.directive';
import { UpdateAppModalComponent } from './components/update-app-modal/update-app-modal.component';
import { ToastWithButtonsComponent } from './components/toast-with-buttons/toast-with-buttons.component';
import { TokenSelectionListComponent } from './components/token-selection-list/token-selection-list.component';
import { SuitePipe } from './pipes/suite/suite.pipe';
import { CoinSelectorComponent } from './components/coin-selector/coin-selector.component';
import { FilterTabComponent } from '../modules/defi-investments/shared-defi-investments/components/filter-tab/filter-tab.component';
import { SelectProviderCardComponent } from '../modules/fiat-ramps/select-provider-page/components/select-provider-card/select-provider-card.component';
import { ProviderCardComponent } from '../modules/fiat-ramps/select-provider-page/components/provider-card/provider-card/provider-card.component';
import { TransactionFeeComponent } from '../modules/defi-investments/shared-defi-investments/components/transaction-fee/transaction-fee.component';
import { AmountInputCardComponent } from './components/amount-input-card/amount-input-card.component';
import { AmountInputCardSkeletonComponent } from './components/amount-input-card/amount-input-card-skeleton/amount-input-card-skeleton.component';
import { ObjetiveCardComponent } from '../modules/financial-planner/shared-financial-planner/components/objetive-card/objetive-card.component';
import { NumberInputDirective } from './directives/number-input/number-input.directive';
import { CauseComponent } from '../modules/donations/shared-donations/components/cause/cause.component';
import { FormattedAmountPipe } from './pipes/formatted-amount/formatted-amount.pipe';
import { CauseInfoComponent } from '../modules/donations/shared-donations/components/description-cause/cause-info.component';
import { ErrorsFormPasswordItemComponent } from './components/errors-form-password-item/errors-form-password-item.component';
import { FormattedNetworkPipe } from './pipes/formatted-network-name/formatted-network.pipe';
import { BackupInformationCardComponent } from '../modules/wallets/shared-wallets/components/backup-information-card/backup-information-card.component';
import { ExplanationItemComponent } from '../modules/financial-education/shared-financial-education/components/explanation-item/explanation-item.component';
import { InfoPhraseAdviceModalComponent } from '../modules/wallets/shared-wallets/components/info-phrase-advice-modal/info-phrase-advice-modal.component';
import { RuleCardComponent } from '../modules/financial-education/shared-financial-education/components/rule-card/rule-card.component';
import { CircleProgressComponent } from './components/circle-progress/circle-progress.component';
import { InfoSendModalComponent } from '../modules/wallets/shared-wallets/components/info-send-modal/info-send-modal.component';
import { EyeComponent } from './components/eye/eye.component';
import { SkipProfileTestComponent } from '../modules/profiles/shared-profiles/components/skip-profile-test/skip-profile-test.component';
import { InformationAlertComponent } from '../modules/users/shared-users/components/information-alert/information-alert.component';
import { HelpItemCardComponent } from '../modules/users/shared-users/components/help-item-card/help-item-card.component';
import { NewTokenAvailableCardComponent } from '../modules/wallets/shared-wallets/components/new-token-available-card/new-token-available-card.component';
import { NewTokenInfoModalComponent } from '../modules/wallets/shared-wallets/components/new-token-info-modal/new-token-info-modal.component';
import { InformationModalComponent } from './components/information-modal/information-modal.component';
import { TwoButtonsAlertComponent } from './components/two-buttons-alert/two-buttons-alert.component';
import { BuyCryptoFeatureFlagDirective } from './directives/in-review-feature-flag/buy-crypto-feature-flag.directive';
import { TokenNetworkBadgeComponent } from './components/token-network-badge/token-network-badge.component';
import { OperationStatusChipComponent } from '../modules/fiat-ramps/shared-ramps/components/operation-status-chip/operation-status-chip.component';
import { CommaToDotDirective } from './directives/comma-to-dot/comma-to-dot.directive';
import { InProgressTransactionModalComponent } from './components/in-progress-transaction-modal/in-progress-transaction-modal.component';
import { AssetDetailComponent } from './components/asset-detail/asset-detail.component';
import { AddressInputCardComponent } from '../modules/wallets/shared-wallets/components/address-input-card/address-input-card.component';
import { ContactItemComponent } from './components/contact-item/contact-item.component';
import { ModalAsAlertComponent } from './components/modal-as-alert/modal-as-alert.component';
import { RequireTokenComponent } from './components/require-token/require-token.component';
import { HideEmailPipe } from './pipes/hide-email/hide-email.pipe';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { GeneralModalWithTwoButtonsComponent } from './components/general-modal-with-two-buttons/general-modal-with-two-buttons.component';
import { WarrantyInProgressTransactionModalComponent } from './components/warranty-in-progress-transaction-modal/warranty-in-progress-transaction-modal.component';
import { WhatsappSupportComponent } from './components/whatsapp-support/whatsapp-support.component';
import { WarrantySummaryCardComponent } from '../modules/warranties/shared-warranties/components/warranty-summary-card/warranty-summary-card.component';
import { CoinContentItemComponent } from '../modules/fiat-ramps/shared-ramps/components/coin-content-item/coin-content-item.component';
import { UserRegisterStepCardComponent } from './components/user-register-step-card/user-register-step-card.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';
import { GeneralModalWithButtonComponent } from './components/general-modal-with-button/general-modal-with-button.component';

@NgModule({
  declarations: [
    FilterTabComponent,
    ErrorsFormItemComponent,
    ErrorsFormPasswordItemComponent,
    PercentageDisplayComponent,
    XcapitLogoComponent,
    NeedHelpComponent,
    ToastAlertComponent,
    ScanQrModalComponent,
    EmbedVideoComponent,
    LoadingModalComponent,
    QuotesCardComponent,
    ItemQuoteComponent,
    TokenSelectionListComponent,
    TransactionFeeComponent,
    AmountInputCardComponent,
    AmountInputCardSkeletonComponent,
    EyeComponent,
    SkipProfileTestComponent,
    InProgressTransactionModalComponent,
    WarrantyInProgressTransactionModalComponent,
    ContactItemComponent,
    ModalAsAlertComponent,
    WhatsappSupportComponent,
    // Ux
    CoinContentItemComponent,
    NewTokenInfoModalComponent,
    NewTokenAvailableCardComponent,
    HelpItemCardComponent,
    InformationAlertComponent,
    InfoSendModalComponent,
    CircleProgressComponent,
    RuleCardComponent,
    InfoPhraseAdviceModalComponent,
    BackupInformationCardComponent,
    ExplanationItemComponent,
    SelectModalNewComponent,
    UxInputComponent,
    UxCenterImgComponent,
    UxTitleComponent,
    UxTextComponent,
    UxRadioGroupComponent,
    UxAlertMessageComponent,
    UxRangeComponent,
    UxCardInfoRobotComponent,
    UxListComponent,
    UxListInvertedComponent,
    UxSelectModalComponent,
    UxInputSelectComponent,
    UxListCardComponent,
    UxLoadingBlockComponent,
    BinanceLogoComponent,
    SuccessContentComponent,
    UxCheckboxComponent,
    UxDateRangeComponent,
    UxTextareaComponent,
    IconButtonCardComponent,
    UxSegmentComponent,
    UxInputUnderlinedComponent,
    UxStepProgressBarComponent,
    UxRadioItemComponent,
    UxRadioItemGroupComponent,
    InputSelectComponent,
    SupportOptionsCardComponent,
    ContactSupportComponent,
    FaqComponent,
    TestOptionItemComponent,
    AvatarProfileComponent,
    UpdateAppModalComponent,
    NetworkSelectCardComponent,
    NoWalletComponent,
    UpdateNewsComponent,
    NewsItemComponent,
    ToastWithButtonsComponent,
    CoinSelectorComponent,
    SelectProviderCardComponent,
    ProviderCardComponent,
    CauseComponent,
    ObjetiveCardComponent,
    CauseInfoComponent,
    InformationModalComponent,
    TwoButtonsAlertComponent,
    TokenNetworkBadgeComponent,
    OperationStatusChipComponent,
    AssetDetailComponent,
    AddressInputCardComponent,
    RequireTokenComponent,
    SearchBarComponent,
    WarrantySummaryCardComponent,
    GeneralModalWithTwoButtonsComponent,
    UserRegisterStepCardComponent,
    SuccessModalComponent,
    GeneralModalWithButtonComponent,
    // Pipes
    LocalizedDatePipe,
    HideEmailPipe,
    SafeURLPipe,
    HideTextPipe,
    SplitStringPipe,
    SuitePipe,
    FormattedNetworkPipe,
    FormattedAmountPipe,
    //Directives
    SelectStyleDirective,
    NumberInputDirective,
    ButtonSpinnerDirective,
    FeatureFlagDirective,
    BuyCryptoFeatureFlagDirective,
    CommaToDotDirective,
  ],
  imports: [CommonModule, IonicModule, TranslateModule.forChild(), TrackClickModule, ReactiveFormsModule],
  exports: [
    CircleProgressComponent,
    FilterTabComponent,
    EmbedVideoComponent,
    ErrorsFormItemComponent,
    ErrorsFormPasswordItemComponent,
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    TrackClickModule,
    PercentageDisplayComponent,
    XcapitLogoComponent,
    NeedHelpComponent,
    ToastAlertComponent,
    ScanQrModalComponent,
    LoadingModalComponent,
    UpdateAppModalComponent,
    QuotesCardComponent,
    ItemQuoteComponent,
    NetworkSelectCardComponent,
    TokenSelectionListComponent,
    CoinSelectorComponent,
    TransactionFeeComponent,
    AmountInputCardComponent,
    AmountInputCardSkeletonComponent,
    EyeComponent,
    SkipProfileTestComponent,
    InProgressTransactionModalComponent,
    WarrantyInProgressTransactionModalComponent,
    ContactItemComponent,
    ModalAsAlertComponent,
    WhatsappSupportComponent,
    // Ux
    CoinContentItemComponent,
    NewTokenInfoModalComponent,
    NewTokenAvailableCardComponent,
    HelpItemCardComponent,
    InformationAlertComponent,
    InfoSendModalComponent,
    RuleCardComponent,
    InfoPhraseAdviceModalComponent,
    BackupInformationCardComponent,
    ExplanationItemComponent,
    SelectModalNewComponent,
    UxInputComponent,
    UxCenterImgComponent,
    UxTitleComponent,
    UxTextComponent,
    UxRadioGroupComponent,
    UxAlertMessageComponent,
    UxRangeComponent,
    UxCardInfoRobotComponent,
    UxListComponent,
    UxListInvertedComponent,
    UxSelectModalComponent,
    UxInputSelectComponent,
    UxListCardComponent,
    UxLoadingBlockComponent,
    BinanceLogoComponent,
    SuccessContentComponent,
    UxCheckboxComponent,
    UxDateRangeComponent,
    UxTextareaComponent,
    IconButtonCardComponent,
    UxSegmentComponent,
    UxInputUnderlinedComponent,
    UxStepProgressBarComponent,
    UxRadioItemComponent,
    UxRadioItemGroupComponent,
    InputSelectComponent,
    SupportOptionsCardComponent,
    ContactSupportComponent,
    FaqComponent,
    TestOptionItemComponent,
    AvatarProfileComponent,
    NoWalletComponent,
    UpdateNewsComponent,
    NewsItemComponent,
    ToastWithButtonsComponent,
    SelectProviderCardComponent,
    ProviderCardComponent,
    CauseComponent,
    ObjetiveCardComponent,
    CauseInfoComponent,
    InformationModalComponent,
    TwoButtonsAlertComponent,
    TokenNetworkBadgeComponent,
    OperationStatusChipComponent,
    AssetDetailComponent,
    AddressInputCardComponent,
    RequireTokenComponent,
    SearchBarComponent,
    WarrantySummaryCardComponent,
    GeneralModalWithTwoButtonsComponent,
    UserRegisterStepCardComponent,
    SuccessModalComponent,
    GeneralModalWithButtonComponent,
    // Pipes
    LocalizedDatePipe,
    HideEmailPipe,
    SafeURLPipe,
    HideTextPipe,
    SplitStringPipe,
    SuitePipe,
    FormattedNetworkPipe,
    FormattedAmountPipe,
    //Directives
    ButtonSpinnerDirective,
    NumberInputDirective,
    FeatureFlagDirective,
    SelectStyleDirective,
    BuyCryptoFeatureFlagDirective,
    CommaToDotDirective,
  ],
})
export class SharedModule {}
