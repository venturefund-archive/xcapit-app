import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuccessPagePage } from './success-page.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessPagePage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SuccessPagePage]
})
export class SuccessPagePageModule {}
