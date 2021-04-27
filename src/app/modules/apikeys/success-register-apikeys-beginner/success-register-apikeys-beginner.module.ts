import { NgModule } from '@angular/core';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';
import { RouterModule, Routes } from '@angular/router';
import { SuccessRegisterApikeysBeginnerPage } from './success-register-apikeys-beginner.page';

const routes: Routes = [
  {
    path: '', 
    component: SuccessRegisterApikeysBeginnerPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), 
    SharedApikeysModule
  ],
  declarations: [SuccessRegisterApikeysBeginnerPage]
})
export class SuccessRegisterApikeysBeginnerPageModule {}
