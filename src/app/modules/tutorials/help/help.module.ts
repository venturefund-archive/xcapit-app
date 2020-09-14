import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpPage } from './help.page';
import { SharedTutorialsModule } from '../shared-tutorials/shared-tutorials.module';

const routes: Routes = [
  {
    path: '',
    component: HelpPage
  }
];

@NgModule({
  imports: [
    SharedTutorialsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HelpPage]
})
export class HelpPageModule {}
