import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';
import { WhatsAnApiKeyPage } from './whats-an-api-key.page';

const routes: Routes = [
  {
    path: '',
    component: WhatsAnApiKeyPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [WhatsAnApiKeyPage],
})
export class WhatsAnApiKeyPageModule {}
