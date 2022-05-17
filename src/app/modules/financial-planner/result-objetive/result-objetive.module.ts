import { NgModule } from '@angular/core';
import { ResultObjetivePage } from './result-objetive.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedFinancialPlannerModule } from '../shared-financial-planner/shared-financial-planner.module';

const routes: Routes = [
  {
    path: '',
    component: ResultObjetivePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedFinancialPlannerModule],
  declarations: [ResultObjetivePage],
})
export class ResultObjetivePageModule {}
