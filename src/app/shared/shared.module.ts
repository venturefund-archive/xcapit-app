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

@NgModule({
  declarations: [
    ErrorsFormItemComponent,
    GooglePlacesDirective,
    LanguagePopoverComponent,
    LanguageButtonComponent
  ],
  entryComponents: [LanguagePopoverComponent],
  imports: [CommonModule, IonicModule, TranslateModule.forChild(), TrackClickModule],
  exports: [
    ErrorsFormItemComponent,
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    GooglePlacesDirective,
    TranslateModule,
    LanguageButtonComponent,
    TrackClickModule
  ]
})
export class SharedModule {}
