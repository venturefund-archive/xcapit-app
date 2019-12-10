import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewApikeysPage } from './new-apikeys.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';

const routes: Routes = [
  {
    path: ':action/:fundName',
    component: NewApikeysPage
  },
  {
    path: ':action',
    component: NewApikeysPage
  },
  {
    path: '',
    redirectTo: '/tabs/funds',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [SharedApikeysModule, RouterModule.forChild(routes)],
  declarations: [NewApikeysPage]
})
export class NewApikeysPageModule {}
