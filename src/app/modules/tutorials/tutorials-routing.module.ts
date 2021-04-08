import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'tutorials',
    children: [
      {
        path: 'first-steps',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./first-steps/first-steps.module').then(
            m => m.FirstStepsPageModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorialsRoutingModule {}
