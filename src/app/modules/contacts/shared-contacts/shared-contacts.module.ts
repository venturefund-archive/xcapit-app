import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckboxModalComponent } from './components/checkbox-modal/checkbox-modal.component';
import { MultipleCheckboxSelectComponent } from './components/multiple-checkbox-select/multiple-checkbox-select.component';

@NgModule({
  declarations: [MultipleCheckboxSelectComponent, CheckboxModalComponent],
  imports: [SharedModule],
  exports: [SharedModule, MultipleCheckboxSelectComponent, CheckboxModalComponent],
})
export class SharedContactsModule {}
