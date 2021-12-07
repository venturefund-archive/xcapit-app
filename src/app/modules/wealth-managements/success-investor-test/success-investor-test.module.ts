import { NgModule } from '@angular/core';
import { SuccessInvestorTestPage } from './success-investor-test.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWealthManagementsModule } from '../shared-wealth-managements/shared-wealth-managements.module';
const routes: Routes = [
  {
    path: '',
    component: SuccessInvestorTestPage,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedWealthManagementsModule],
  declarations: [SuccessInvestorTestPage],
})
export class SuccessInvestorTestPageModule {}
