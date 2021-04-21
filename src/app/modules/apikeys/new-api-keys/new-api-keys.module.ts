import { NgModule } from '@angular/core';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';
import { RouterModule, Routes } from '@angular/router';
import { NewApiKeysPage } from './new-api-keys.page';

const routes: Routes = [
  {
    path: '',
    component: NewApiKeysPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), SharedApikeysModule
  ],
  declarations: [NewApiKeysPage]
})
export class NewApiKeysPageModule {}
