import { NgModule } from '@angular/core';
import { SuccessDeleteAccountPage } from './success-delete-account.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../../fiat-ramps/shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessDeleteAccountPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedRampsModule],
  declarations: [SuccessDeleteAccountPage],
})
export class SuccessDeleteAccountPageModule {}
