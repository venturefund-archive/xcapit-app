import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { DerivedPathOptionsPage } from './derived-path-options.page';

const routes: Routes = [
  {
    path: ':mode',
    component: DerivedPathOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [DerivedPathOptionsPage]
})
export class DerivedPathOptionsPageModule {}
