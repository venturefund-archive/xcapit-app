import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';
import { HasFundsGuard } from './shared-tutorials/guards/has-funds/has-funds.guard';

const routes: Routes = [
  {
    path: 'tutorials',
    children: [
      {
        path: 'interactive-tutorial',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./interactive-tutorial/interactive-tutorial.module').then(
            m => m.InteractiveTutorialPageModule
          )
      },
      {
        path: 'help',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./help/help.module').then(m => m.HelpPageModule)
      },
      {
        path: 'first-steps',
        canActivate: [AuthGuard, HasFundsGuard],
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
