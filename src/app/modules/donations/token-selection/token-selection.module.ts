import { NgModule } from '@angular/core';
import { TokenSelectionPage } from './token-selection.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedDonationsModule } from '../shared-donations/shared-donations.module';

const routes: Routes = [
  {
    path: '',
    component: TokenSelectionPage,
  },
  {
    path: ':cause',
    component: TokenSelectionPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), SharedDonationsModule
  ],
  declarations: [TokenSelectionPage]
})
export class TokenSelectionPageModule {}
