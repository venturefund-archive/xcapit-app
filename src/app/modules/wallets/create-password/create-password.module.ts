import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { CreatePasswordPage } from './create-password.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePasswordPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [CreatePasswordPage],
})
export class CreatePasswordPageModule {}
