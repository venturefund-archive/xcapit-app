import { NgModule } from '@angular/core';
import { FinancialFreedomPage } from './financial-freedom.page';
import { SharedFinancialEducationModule } from '../../shared-financial-education/shared-financial-education.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: FinancialFreedomPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), SharedFinancialEducationModule
  ],
  declarations: [FinancialFreedomPage]
})
export class FinancialFreedomPageModule {}
