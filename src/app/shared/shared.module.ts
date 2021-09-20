import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ErrorsFormItemComponent } from './components/errors-form-item/errors-form-item.component';
import { GooglePlacesDirective } from './directives/google-places.directive';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagePopoverComponent } from './components/language-popover/language-popover.component';
import { LanguageButtonComponent } from './components/language-button/language-button.component';
import { TrackClickModule } from './directives/track-click/track-click.module';
import { IsSubscribedComponent } from './components/is-subscribed/is-subscribed.component';
import { TrackClickUnauthModule } from './directives/track-click-unauth/track-click-unauth.module';
import { PercentageDisplayComponent } from './components/percentage-display/percentage-display.component';
import { XcapitLogoComponent } from './components/xcapit-logo/xcapit-logo.component';
import { UxInputComponent } from './components/ux-input/ux-input.component';
import { UxInputGooglePlacesComponent } from './components/ux-input-google-places/ux-input-google-places.component';
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
import { UxInputSelectTraductionComponent } from './components/ux-input-select-traduction/ux-input-select-traduction.component';
import { UxStepProgressBarComponent } from './components/ux-step-progress-bar/ux-step-progress-bar.component';
import { UxInputSelectImageComponent } from './components/ux-input-select-image/ux-input-select-image.component';
import { InputSelectNewComponent } from './components/input-select-new/input-select-new.component';
import { SelectModalNewComponent } from './components/select-modal-new/select-modal-new.component';
import { SelectStyleDirective } from './directives/select-style/select-style.directive';

@NgModule({
  declarations: [
    ErrorsFormItemComponent,
    GooglePlacesDirective,
    LanguagePopoverComponent,
    LanguageButtonComponent,
    IsSubscribedComponent,
    PercentageDisplayComponent,
    XcapitLogoComponent,
    NeedHelpComponent,
    ToastAlertComponent,
    ScanQrModalComponent,
    // Ux
    SelectModalNewComponent,
    UxInputSelectImageComponent,
    UxInputSelectTraductionComponent,
    UxInputComponent,
    UxInputGooglePlacesComponent,
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
    InputSelectNewComponent,
    // Pipes
    LocalizedDatePipe,
    HideReferralPipe,
    SelectStyleDirective,
  ],
  entryComponents: [LanguagePopoverComponent, UxSelectModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
    TrackClickModule,
    TrackClickUnauthModule,
    ReactiveFormsModule,
  ],
  exports: [
    ErrorsFormItemComponent,
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    GooglePlacesDirective,
    TranslateModule,
    LanguageButtonComponent,
    TrackClickModule,
    TrackClickUnauthModule,
    IsSubscribedComponent,
    PercentageDisplayComponent,
    XcapitLogoComponent,
    NeedHelpComponent,
    ToastAlertComponent,
    ScanQrModalComponent,
    // Ux
    SelectModalNewComponent,
    UxInputSelectImageComponent,
    UxInputSelectTraductionComponent,
    UxInputComponent,
    UxInputGooglePlacesComponent,
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
    InputSelectNewComponent,
    // Pipes
    LocalizedDatePipe,
    HideReferralPipe,
    SelectStyleDirective,
  ],
})
export class SharedModule {}
