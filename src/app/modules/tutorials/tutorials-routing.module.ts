import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'tutorials',
    children: [
      {
        path: 'interactive-tutorial',
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
