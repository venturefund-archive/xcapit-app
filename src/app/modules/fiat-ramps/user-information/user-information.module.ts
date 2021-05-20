import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserInformationPage } from './user-information.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: UserInformationPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserInformationPage]
})
export class UserInformationPageModule {}
