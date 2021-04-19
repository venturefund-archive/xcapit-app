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
import { UxSuccessImgComponent } from './components/ux-success-img/ux-success-img.component';
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
import { UxSelectableListComponent } from './components/ux-selectable-list/ux-selectable-list.component';
import { LocalizedDatePipe } from './pipes/localized-date/localized-date.pipe';
import { UxLoadingBlockComponent } from './components/ux-loading-block/ux-loading-block.component';
import { UxListInvertedComponent } from './components/ux-list-inverted/ux-list-inverted.component';
import { UxCheckboxComponent } from './components/ux-checkbox/ux-checkbox.component';
import { UxDateRangeComponent } from './components/ux-date-range/ux-date-range.component';
import { NeedHelpComponent } from './components/need-help/need-help.component';

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
    // Ux
    UxInputComponent,
    UxInputGooglePlacesComponent,
    UxSuccessImgComponent,
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
    UxSelectableListComponent,
    UxLoadingBlockComponent,
    BinanceLogoComponent,
    SuccessContentComponent,
    UxCheckboxComponent,
    UxDateRangeComponent,
    // Pipes
    LocalizedDatePipe,
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
    // Ux
    UxInputComponent,
    UxInputGooglePlacesComponent,
    UxSuccessImgComponent,
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
    UxSelectableListComponent,
    UxLoadingBlockComponent,
    BinanceLogoComponent,
    SuccessContentComponent,
    UxCheckboxComponent,
    UxDateRangeComponent,
    // Pipes
    LocalizedDatePipe,
  ],
})
export class SharedModule {}
