import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GlobalProgressCardComponent } from './components/global-progress-card/global-progress-card.component';
import { ModulesEducationComponent } from './components/modules-education/modules-education.component';
import { ShareEducationComponent } from './components/share-education/share-education.component';

@NgModule({
  declarations: [ModulesEducationComponent, ShareEducationComponent, GlobalProgressCardComponent],
  imports: [SharedModule],
  exports: [SharedModule, ModulesEducationComponent, ShareEducationComponent, GlobalProgressCardComponent],
})
export class SharedFinancialEducationModule {}
