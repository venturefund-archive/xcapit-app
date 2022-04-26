import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'financial-planner',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'information',
        loadChildren: () => import('../financial-planner/planner-information/planner-information.module').then(m => m.PlannerInformationPageModule)
      },
      {
        path: 'objetive-info',
        loadChildren: () => import('./objetive-info/objetive-info.module').then( m => m.ObjetiveInfoPageModule)
      },
      {
        path: 'new-objetive',
        loadChildren: () => import('./new-objetive/new-objetive.module').then( m => m.NewObjetivePageModule)
      }
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialPlannerRoutingModule { }
