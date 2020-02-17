import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuccessApikeysPage } from './success-apikeys.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessApikeysPage
  }
];

@NgModule({
  imports: [
    SharedApikeysModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SuccessApikeysPage]
})
export class SuccessApikeysPageModule {}
