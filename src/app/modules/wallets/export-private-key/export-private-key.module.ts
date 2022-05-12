import { NgModule } from '@angular/core';
import { ExportPrivateKeyPage } from './export-private-key.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: ExportPrivateKeyPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [ExportPrivateKeyPage],
  providers: [],
})
export class ExportPrivateKeyPageModule {}
