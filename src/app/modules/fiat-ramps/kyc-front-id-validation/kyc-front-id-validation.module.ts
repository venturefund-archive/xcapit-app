import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { KycFrontIdValidationPage } from './kyc-front-id-validation.page';

const routes: Routes = [
  {
    path: '',
    component: KycFrontIdValidationPage
  }
];

@NgModule({
  imports: [
    SharedRampsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KycFrontIdValidationPage]
})
export class KycFrontIdValidationPageModule {}
