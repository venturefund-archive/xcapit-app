import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { OneInchTosCheckComponent } from './components/one-inch-tos-check/one-inch-tos-check.component';


@NgModule({
  declarations: [OneInchTosCheckComponent],
  imports: [SharedModule],
  exports: [SharedModule, OneInchTosCheckComponent]
})
export class SharedSwapsModule { }
