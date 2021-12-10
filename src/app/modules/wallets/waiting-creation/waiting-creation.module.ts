import { NgModule } from '@angular/core';
import { WaitingCreationPage } from './waiting-creation.page';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: WaitingCreationPage }];
@NgModule({
  imports: [SharedWalletsModule, RouterModule.forChild(routes)],
  declarations: [WaitingCreationPage],
})
export class WaitingCreationPageModule {}
