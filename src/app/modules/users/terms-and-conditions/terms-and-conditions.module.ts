import { NgModule } from '@angular/core';
import { TermsAndConditionsPage } from './terms-and-conditions.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedUsersModule } from '../shared-users/shared-users.module';

const routes: Routes = [
  {
    path: '',
    component: TermsAndConditionsPage
  }
];

@NgModule({
  imports: [
    SharedUsersModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TermsAndConditionsPage]
})
export class TermsAndConditionsPageModule {}
