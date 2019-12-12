import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LinkedApikeysPage } from './linked-apikeys.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';

const routes: Routes = [
  {
    path: '',
    component: LinkedApikeysPage
  }
];

@NgModule({
  imports: [
    SharedApikeysModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LinkedApikeysPage]
})
export class LinkedApikeysPageModule {}
