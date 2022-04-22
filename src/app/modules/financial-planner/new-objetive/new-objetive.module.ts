import { NgModule } from '@angular/core';
import { NewObjetivePage } from './new-objetive.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedFinancialPlannerModule } from '../shared-financial-planner/shared-financial-planner.module';

const routes: Routes = [
  {
    path: '',
    component: NewObjetivePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedFinancialPlannerModule],
  declarations: [NewObjetivePage]
})

export class NewObjetivePageModule {}
