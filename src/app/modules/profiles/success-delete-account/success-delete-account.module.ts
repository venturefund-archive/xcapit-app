import { NgModule } from '@angular/core';
import { SuccessDeleteAccountPage } from './success-delete-account.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessDeleteAccountPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedProfilesModule],
  declarations: [SuccessDeleteAccountPage],
})
export class SuccessDeleteAccountPageModule {}
