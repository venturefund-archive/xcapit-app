import { NgModule } from '@angular/core';

import { RegisterPage } from './register.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  }
];

@NgModule({
  imports: [

    RouterModule.forChild(routes), 
    SharedApikeysModule
    
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
