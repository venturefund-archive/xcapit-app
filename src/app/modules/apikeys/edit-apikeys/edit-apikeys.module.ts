import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditApiKeyPage } from './edit-apikeys.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';

const routes: Routes = [
  {
    path: '',
    component: EditApiKeyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [EditApiKeyPage]
})
export class EditApiKeyPageModule {}
