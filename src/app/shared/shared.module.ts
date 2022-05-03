import { SplitStringPipe } from './pipes/split-string/split-string.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ErrorsFormItemComponent } from './components/errors-form-item/errors-form-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagePopoverComponent } from './components/language-popover/language-popover.component';
import { LanguageButtonComponent } from './components/language-button/language-button.component';
import { TrackClickModule } from './directives/track-click/track-click.module';
import { IsSubscribedComponent } from './components/is-subscribed/is-subscribed.component';
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
import { UxDatetimeComponent } from './components/ux-datetime/ux-datetime.component';
import { NeedHelpComponent } from './components/need-help/need-help.component';
import { HideReferralPipe } from './pipes/hide-referral/hide-referral.pipe';
import { ToastAlertComponent } from './components/new-toasts/toast-alert/toast-alert.component';
import { IconButtonCardComponent } from './components/icon-button-card/icon-button-card.component';
import { SliderNewsCardComponent } from './components/slider-news/slider-news.component';
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
import { WalletTotalBalanceCardComponent } from '../modules/home/shared-home/components/wallet-total-balance-card/wallet-total-balance-card.component';
import { HideTextPipe } from './pipes/hide-text/hide-text.pipe';
import { NeedHelpCardComponent } from '../modules/home/shared-home/components/need-help-card/need-help-card.component';
import { InvestorTestCardsComponent } from '../modules/home/shared-home/components/investor-test-cards/investor-test-cards.component';
import { WalletConnectCardComponent } from '../modules/home/shared-home/components/wallet-connect-card/wallet-connect-card.component';
import { QuotesCardComponent } from '../modules/home/shared-home/components/quotes-card/quotes-card.component';
import { ItemQuoteComponent } from '../modules/home/shared-home/components/item-quote/item-quote.component';
import { NetworkSelectCardComponent } from '../modules/wallets/shared-wallets/components/network-select-card/network-select-card.component';
import { NoWalletComponent } from './components/no-wallet/no-wallet.component';
import { ButtonSpinnerDirective } from './directives/button-spinner/button-spinner.directive';
import { UpdateNewsComponent } from './components/update-news/update-news.component';
import { NewsItemComponent } from './components/news-item/news-item.component';
import { FeatureFlagDirective } from './directives/feature-flag/feature-flag.directive';
import { UpdateAppModalComponent } from './components/update-app-modal/update-app-modal.component';
import { ToastWithButtonsComponent } from '../modules/defi-investments/shared-defi-investments/components/toast-with-buttons/toast-with-buttons.component';
import { TokenSelectionListComponent } from './components/token-selection-list/token-selection-list.component';
import { SuitePipe } from './pipes/suite/suite.pipe';
import { CoinSelectorComponent } from './components/coin-selector/coin-selector.component';
import { FilterTabComponent } from '../modules/defi-investments/shared-defi-investments/components/filter-tab/filter-tab.component';
import { SelectProviderCardComponent } from '../modules/fiat-ramps/select-provider-page/components/select-provider-card/select-provider-card.component';
import { ProviderCardComponent } from '../modules/fiat-ramps/select-provider-page/components/provider-card/provider-card/provider-card.component';
import { AmountInputCardComponent } from './components/amount-input-card/amount-input-card.component';
import { ObjetiveCardComponent } from '../modules/financial-planner/shared-financial-planner/components/objetive-card/objetive-card.component';
import { NumberInputDirective } from './directives/number-input/number-input.directive';
import { FormattedNetworkPipe } from '../modules/wallets/shared-wallets/pipes/formatted-network-name/formatted-network.pipe';

@NgModule({
  declarations: [
    FilterTabComponent,
    ErrorsFormItemComponent,
    LanguagePopoverComponent,
    LanguageButtonComponent,
    IsSubscribedComponent,
    PercentageDisplayComponent,
    XcapitLogoComponent,
    NeedHelpComponent,
    ToastAlertComponent,
    ScanQrModalComponent,
    EmbedVideoComponent,
    LoadingModalComponent,
    NeedHelpCardComponent,
    InvestorTestCardsComponent,
    WalletConnectCardComponent,
    QuotesCardComponent,
    ItemQuoteComponent,
    TokenSelectionListComponent,
    AmountInputCardComponent,
    // Ux
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
    UxDatetimeComponent,
    IconButtonCardComponent,
    SliderNewsCardComponent,
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
    WalletTotalBalanceCardComponent,
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
    ObjetiveCardComponent,
    // Pipes
    LocalizedDatePipe,
    HideReferralPipe,
    SafeURLPipe,
    HideTextPipe,
    SplitStringPipe,
    SuitePipe,
    FormattedNetworkPipe,
    //Directives
    SelectStyleDirective,
    NumberInputDirective,
    ButtonSpinnerDirective,
    FeatureFlagDirective,
  ],
  entryComponents: [LanguagePopoverComponent, UxSelectModalComponent],
  imports: [CommonModule, IonicModule, TranslateModule.forChild(), TrackClickModule, ReactiveFormsModule],
  exports: [
    FilterTabComponent,
    EmbedVideoComponent,
    ErrorsFormItemComponent,
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    LanguageButtonComponent,
    TrackClickModule,
    IsSubscribedComponent,
    PercentageDisplayComponent,
    XcapitLogoComponent,
    NeedHelpComponent,
    ToastAlertComponent,
    ScanQrModalComponent,
    LoadingModalComponent,
    UpdateAppModalComponent,
    NeedHelpCardComponent,
    InvestorTestCardsComponent,
    WalletConnectCardComponent,
    QuotesCardComponent,
    ItemQuoteComponent,
    NetworkSelectCardComponent,
    TokenSelectionListComponent,
    CoinSelectorComponent,
    AmountInputCardComponent,
    // Ux
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
    UxDatetimeComponent,
    IconButtonCardComponent,
    SliderNewsCardComponent,
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
    WalletTotalBalanceCardComponent,
    AvatarProfileComponent,
    NoWalletComponent,
    UpdateNewsComponent,
    NewsItemComponent,
    ToastWithButtonsComponent,
    SelectProviderCardComponent,
    ProviderCardComponent,
    ObjetiveCardComponent,
    // Pipes
    LocalizedDatePipe,
    HideReferralPipe,
    SafeURLPipe,
    HideTextPipe,
    SplitStringPipe,
    SuitePipe,
    FormattedNetworkPipe,
    //Directives
    ButtonSpinnerDirective,
    NumberInputDirective,
    FeatureFlagDirective,
    SelectStyleDirective,
  ],
})
export class SharedModule {}
