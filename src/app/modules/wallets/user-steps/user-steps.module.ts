import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { UserStepsPage } from './user-steps.page';


const routes: Routes = [
  {
    path: '',
    component: UserStepsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [UserStepsPage],
})
export class UserStepsPageModule {}
