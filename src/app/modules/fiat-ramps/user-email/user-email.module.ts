import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

import { UserEmailPage } from './user-email.page';

const routes: Routes = [
  {
    path: '',
    component: UserEmailPage
  }
];

@NgModule({
  imports: [
    SharedRampsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserEmailPage]
})
export class UserEmailPageModule {}
