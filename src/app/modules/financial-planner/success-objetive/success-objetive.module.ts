import { NgModule } from '@angular/core';
import { SuccessObjetivePage } from './success-objetive.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedFinancialPlannerModule } from '../shared-financial-planner/shared-financial-planner.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessObjetivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedFinancialPlannerModule],
  declarations: [SuccessObjetivePage],
})

export class SuccessObjetivePageModule {}
