import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { UserStepsNaranjaxPage } from './user-steps-naranjax.page';


const routes: Routes = [
  {
    path: '',
    component: UserStepsNaranjaxPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [UserStepsNaranjaxPage],
})
export class UserStepsNaranjaxPageModule {}
