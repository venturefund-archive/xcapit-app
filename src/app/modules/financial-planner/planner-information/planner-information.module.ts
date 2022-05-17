import { NgModule } from '@angular/core';
import { PlannerInformationPage } from './planner-information.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedFinancialPlannerModule } from '../shared-financial-planner/shared-financial-planner.module';

const routes: Routes = [
  {
    path: '',
    component: PlannerInformationPage,
  },
];
@NgModule({
  imports: [
    SharedFinancialPlannerModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PlannerInformationPage]
})
export class PlannerInformationPageModule {}
