import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralPage } from './general.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: ':derivation',
    component: GeneralPage
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [GeneralPage]
})
export class GeneralPageModule {}
