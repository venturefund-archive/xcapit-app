import { NgModule } from '@angular/core';
import { NewConnectionPage } from './new-connection.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: NewConnectionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [NewConnectionPage],
})
export class NewConnectionPageModule {}
