import { NgModule } from '@angular/core';
import { InvestorTestOptionsPage } from './investor-test-options.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWealthManagementsModule } from '../shared-wealth-managements/shared-wealth-managements.module';
const routes: Routes = [
  {
    path: '',
    component: InvestorTestOptionsPage,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedWealthManagementsModule],
  declarations: [InvestorTestOptionsPage],
})
export class InvestorTestOptionsPageModule {}
