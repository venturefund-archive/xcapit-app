import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlannerIntroductionCompletedGuard } from './shared-financial-planner/guards/planner-introduction-completed';
import { AuthNewGuard } from '../users/shared-users/guards/auth-new/auth-new.guard';

const routes: Routes = [
  {
    path: 'financial-planner',
    canActivate: [AuthNewGuard],
    children: [
      {
        path: 'information',
        loadChildren: () =>
          import('../financial-planner/planner-information/planner-information.module').then(
            (m) => m.PlannerInformationPageModule
          ),
      },
      {
        path: 'objetive-info',
        loadChildren: () => import('./objetive-info/objetive-info.module').then((m) => m.ObjetiveInfoPageModule),
      },
      {
        path: 'new-objetive',
        loadChildren: () => import('./new-objetive/new-objetive.module').then((m) => m.NewObjetivePageModule),
      },
      {
        path: 'result-objetive',
        canActivate: [PlannerIntroductionCompletedGuard],
        loadChildren: () => import('./result-objetive/result-objetive.module').then((m) => m.ResultObjetivePageModule),
      },
      {
        path: 'success-objetive',
        loadChildren: () =>
          import('./success-objetive/success-objetive.module').then((m) => m.SuccessObjetivePageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialPlannerRoutingModule {}
