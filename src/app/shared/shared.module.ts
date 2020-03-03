import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
import { StepperComponent } from './components/stepper/stepper.component';
import { XcapitHeaderTramaComponent } from './components/xcapit-header-trama/xcapit-header-trama.component';
import { XcapitLogoComponent } from './components/xcapit-logo/xcapit-logo.component';
import { UxInputComponent } from './components/ux-input/ux-input.component';
import { UxInputGooglePlacesComponent } from './components/ux-input-google-places/ux-input-google-places.component';
import { BinanceLogoComponent } from './components/binance-logo/binance-logo.component';
import { NcListComponent } from './components/nc-list/nc-list.component';
import { NcListItemComponent } from './components/nc-list-item/nc-list-item.component';
import { UxSuccessImgComponent } from './components/ux-success-img/ux-success-img.component';
import { SuccessContentComponent } from './components/success-content/success-content.component';
import { UxTitleComponent } from './components/ux-title/ux-title.component';
import { UxTextComponent } from './components/ux-text/ux-text.component';
import { UxDropDownSelectComponent } from './components/ux-drop-down-select/ux-drop-down-select.component';
import { UxRadioGroupComponent } from './components/ux-radio-group/ux-radio-group.component';
import { UxAlertMessageComponent } from './components/ux-alert-message/ux-alert-message.component';
import { UxRangeComponent } from './components/ux-range/ux-range.component';
import { UxCardInfoRobotComponent } from './components/ux-card-info-robot/ux-card-info-robot.component';

@NgModule({
  declarations: [
    ErrorsFormItemComponent,
    GooglePlacesDirective,
    LanguagePopoverComponent,
    LanguageButtonComponent,
    IsSubscribedComponent,
    PercentageDisplayComponent,
    StepperComponent,
    XcapitHeaderTramaComponent,
    XcapitLogoComponent,
    UxInputComponent,
    UxInputGooglePlacesComponent,
    UxSuccessImgComponent,
    UxTitleComponent,
    UxTextComponent,
    UxDropDownSelectComponent,
    UxRadioGroupComponent,
    UxAlertMessageComponent,
    UxRangeComponent,
    UxCardInfoRobotComponent,
    BinanceLogoComponent,
    NcListComponent,
    NcListItemComponent,
    SuccessContentComponent
  ],
  entryComponents: [LanguagePopoverComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
    TrackClickModule,
    TrackClickUnauthModule,
    ReactiveFormsModule
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
    StepperComponent,
    XcapitHeaderTramaComponent,
    XcapitLogoComponent,
    UxInputComponent,
    UxInputGooglePlacesComponent,
    UxSuccessImgComponent,
    UxTitleComponent,
    UxTextComponent,
    UxDropDownSelectComponent,
    UxRadioGroupComponent,
    UxAlertMessageComponent,
    UxRangeComponent,
    UxCardInfoRobotComponent,
    BinanceLogoComponent,
    NcListComponent,
    NcListItemComponent,
    SuccessContentComponent
  ]
})
export class SharedModule {}
