import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsertKeyPage } from './insert-key.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';

const routes: Routes = [
  {
    path: '',
    component: InsertKeyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [InsertKeyPage]
})
export class InsertKeyPageModule {}
