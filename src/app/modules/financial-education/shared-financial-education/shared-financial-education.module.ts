import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShareEducationComponent } from './components/share-education/share-education.component';

@NgModule({
  declarations: [ShareEducationComponent],
  imports: [SharedModule],
  exports: [SharedModule, ShareEducationComponent],
})
export class SharedFinancialEducationModule {}