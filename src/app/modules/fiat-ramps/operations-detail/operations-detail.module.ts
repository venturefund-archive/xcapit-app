import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperationsDetailPage } from './operations-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: OperationsDetailPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OperationsDetailPage]
})
export class OperationsDetailPageModule {}
