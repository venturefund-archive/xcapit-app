import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { KycConfirmationPage } from './kyc-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: KycConfirmationPage
  }
];

@NgModule({
  imports: [
    SharedRampsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KycConfirmationPage]
})
export class KycConfirmationPageModule {}
