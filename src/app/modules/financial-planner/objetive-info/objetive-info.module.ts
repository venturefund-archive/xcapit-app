import { NgModule } from '@angular/core';
import { ObjetiveInfoPage } from './objetive-info.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedFinancialPlannerModule } from '../shared-financial-planner/shared-financial-planner.module';
const routes: Routes = [
  {
    path: '',
    component: ObjetiveInfoPage,
  },
];
@NgModule({
  imports: [
    SharedFinancialPlannerModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ObjetiveInfoPage]
})
export class ObjetiveInfoPageModule {}
