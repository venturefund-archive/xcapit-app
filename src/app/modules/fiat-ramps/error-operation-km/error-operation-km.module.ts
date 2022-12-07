import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ErrorOperationKmPage } from './error-operation-km.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: ErrorOperationKmPage,
  },
];
@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes) ],
  declarations: [ErrorOperationKmPage]
})
export class ErrorOperationKmPageModule {}
