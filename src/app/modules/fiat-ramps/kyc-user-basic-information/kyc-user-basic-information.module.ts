import { NgModule } from '@angular/core';
import { KycUserBasicInformationPage } from './kyc-user-basic-information.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';


const routes: Routes = [
  {
    path: '',
    component: KycUserBasicInformationPage
  }
];

@NgModule({
  imports: [
    SharedRampsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KycUserBasicInformationPage]
})
export class KycUserBasicInformationPageModule {}
