import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TermsAndConditionsCheckComponent } from './components/one-inch-tos-check/one-inch-tos-check.component';


@NgModule({
  declarations: [TermsAndConditionsCheckComponent],
  imports: [SharedModule],
  exports: [SharedModule, TermsAndConditionsCheckComponent]
})
export class SharedSwapsModule { }
