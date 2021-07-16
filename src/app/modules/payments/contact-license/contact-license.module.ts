import { NgModule } from '@angular/core';
import { ContactLicensePage } from './contact-license.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ContactLicensePage,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [ContactLicensePage],
})
export class ContactLicensePageModule {}
