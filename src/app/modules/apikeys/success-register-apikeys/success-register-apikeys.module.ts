import { NgModule } from '@angular/core';
import { SuccessRegisterApikeysPage } from './success-register-apikeys.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SuccessRegisterApikeysPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), 
    SharedApikeysModule
    
  ],
  declarations: [SuccessRegisterApikeysPage]
})
export class SuccessRegisterPageModule {}
