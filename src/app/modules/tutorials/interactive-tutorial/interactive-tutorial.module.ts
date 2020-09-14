import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InteractiveTutorialPage } from './interactive-tutorial.page';
import { SharedTutorialsModule } from '../shared-tutorials/shared-tutorials.module';


const routes: Routes = [
  {
    path: '',
    component: InteractiveTutorialPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedTutorialsModule
  ],
  declarations: [InteractiveTutorialPage]
})
export class InteractiveTutorialPageModule {}
