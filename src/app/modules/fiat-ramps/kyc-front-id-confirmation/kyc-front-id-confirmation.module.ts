import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { KycFrontIdConfirmationPage } from './kyc-front-id-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: KycFrontIdConfirmationPage
  }
];

@NgModule({
  imports: [
    SharedRampsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KycFrontIdConfirmationPage]
})
export class KycFrontIdConfirmationPageModule {}
