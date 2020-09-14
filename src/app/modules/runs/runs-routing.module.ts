import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'runs',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'run-summary/:pk',
        loadChildren: () =>
          import('./run-summary/run-summary.module').then(
            m => m.RunSummaryPageModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RunsRoutingModule {}
