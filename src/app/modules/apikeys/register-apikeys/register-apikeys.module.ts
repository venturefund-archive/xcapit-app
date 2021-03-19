import { NgModule } from '@angular/core';

import { RegisterApikeysPage } from './register-apikeys.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: RegisterApikeysPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [RegisterApikeysPage],
})
export class RegisterApikeysPageModule {}
