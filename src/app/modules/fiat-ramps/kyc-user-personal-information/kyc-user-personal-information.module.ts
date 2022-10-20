import { NgModule } from '@angular/core';
import { KycUserPersonalInformationPage } from './kyc-user-personal-information.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: KycUserPersonalInformationPage
  }
];

@NgModule({
  imports: [
    SharedRampsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KycUserPersonalInformationPage]
})
export class KycUserPersonalInformationPageModule {}
