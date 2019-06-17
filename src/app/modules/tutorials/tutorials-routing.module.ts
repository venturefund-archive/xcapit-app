import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'tutorials',
    children: [
      {
        path: 'interactive-tutorial',
        canActivate: [AuthGuard],
        loadChildren:
          './interactive-tutorial/interactive-tutorial.module#InteractiveTutorialPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorialsRoutingModule {}
