import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModulesEducationComponent } from './components/modules-education/modules-education.component';

@NgModule({
  declarations: [ModulesEducationComponent],
  imports: [SharedModule],
  exports: [SharedModule, ModulesEducationComponent],
})
export class SharedFinancialEducationModule {}
