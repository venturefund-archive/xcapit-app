import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModulesEducationComponent } from './components/modules-education/modules-education.component';
import { ShareEducationComponent } from './components/share-education/share-education.component';

@NgModule({
  declarations: [ModulesEducationComponent, ShareEducationComponent],
  imports: [SharedModule],
  exports: [SharedModule, ModulesEducationComponent, ShareEducationComponent],
})
export class SharedFinancialEducationModule {}
