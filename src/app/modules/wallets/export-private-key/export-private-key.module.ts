import { NgModule } from '@angular/core';
import { ExportPrivateKeyPage } from './export-private-key.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { FormattedNetworkPipe } from '../shared-wallets/pipes/formatted-network-name/formatted-network.pipe';

const routes: Routes = [
  {
    path: '',
    component: ExportPrivateKeyPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [ExportPrivateKeyPage],
  providers: [FormattedNetworkPipe],
})
export class ExportPrivateKeyPageModule {}
