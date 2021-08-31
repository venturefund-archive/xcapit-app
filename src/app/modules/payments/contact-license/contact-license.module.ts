import { NgModule } from '@angular/core';
import { ContactLicensePage } from './contact-license.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedPaymentsModule } from '../shared-payments/shared-payments.module';

const routes: Routes = [
  {
    path: '',
    component: ContactLicensePage,
  },
];

@NgModule({
  imports: [SharedPaymentsModule, RouterModule.forChild(routes)],
  declarations: [ContactLicensePage],
})
export class ContactLicensePageModule {}
