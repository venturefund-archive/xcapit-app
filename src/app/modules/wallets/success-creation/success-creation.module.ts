import { NgModule } from '@angular/core';
import { SuccessCreationPage } from './success-creation.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessCreationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [SuccessCreationPage],
})
export class SuccessCreationPageModule {}
