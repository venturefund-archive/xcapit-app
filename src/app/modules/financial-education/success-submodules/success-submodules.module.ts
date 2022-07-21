import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedDefiInvestmentsModule } from '../../defi-investments/shared-defi-investments/shared-defi-investments.module';
import { SharedFinancialEducationModule } from '../shared-financial-education/shared-financial-education.module';
import { SuccessSubmodulesPage } from './success-submodules.page';

const routes: Routes = [
  {
    path: 'module/:module/submodule/:submodule',
    component: SuccessSubmodulesPage,
  },
];

@NgModule({
  imports: [SharedDefiInvestmentsModule, SharedFinancialEducationModule, RouterModule.forChild(routes)],
  declarations: [SuccessSubmodulesPage],
})
export class SuccessSubmodulesPageModule {}
