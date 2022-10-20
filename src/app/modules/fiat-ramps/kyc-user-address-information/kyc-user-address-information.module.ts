import { NgModule } from '@angular/core';
import { KycUserAddressInformationPage } from './kyc-user-address-information.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
const routes: Routes = [
  {
    path: '',
    component: KycUserAddressInformationPage
  }
];
@NgModule({
  imports: [
    SharedRampsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KycUserAddressInformationPage]
})
export class KycUserAddressInformationPageModule {}
