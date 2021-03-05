import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



import { SuccessRegisterPage } from './success-register.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SuccessRegisterPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), 
    SharedApikeysModule
    
  ],
  declarations: [SuccessRegisterPage]
})
export class SuccessRegisterPageModule {}
