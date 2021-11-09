import { NgModule } from '@angular/core';
import { ComingSoonPage } from './coming-soon.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: ComingSoonPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [ComingSoonPage],
})
export class ComingSoonPageModule {}
