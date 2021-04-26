import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperationsPagePage } from './operations-page.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: OperationsPagePage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OperationsPagePage]
})
export class OperationsPagePageModule {}
