import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { KycValidationPage } from './kyc-validation.page';

const routes: Routes = [
  {
    path: '',
    component: KycValidationPage
  }
];

@NgModule({
  imports: [
    SharedRampsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KycValidationPage]
})
export class KycValidationPageModule {}
