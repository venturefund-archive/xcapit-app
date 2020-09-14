import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsertSecretPage } from './insert-secret.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';

const routes: Routes = [
  {
    path: '',
    component: InsertSecretPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [InsertSecretPage]
})
export class InsertSecretPageModule {}
