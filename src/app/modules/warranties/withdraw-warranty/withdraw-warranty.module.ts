import { NgModule } from '@angular/core';
import { WithdrawWarrantyPage } from './withdraw-warranty.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: WithdrawWarrantyPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [WithdrawWarrantyPage]
})
export class WithdrawWarrantyPageModule {}
