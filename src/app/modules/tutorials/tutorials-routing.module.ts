import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthNewGuard } from '../users/shared-users/guards/auth-new/auth-new.guard';

const routes: Routes = [
  {
    path: 'tutorials',
    children: [
      {
        path: 'first-steps',
        canActivate: [AuthNewGuard],
        loadChildren: () => import('./first-steps/first-steps.module').then((m) => m.FirstStepsPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialsRoutingModule {}
