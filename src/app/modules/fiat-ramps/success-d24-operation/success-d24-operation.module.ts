import { NgModule } from '@angular/core';
import { SuccessD24OperationPage } from './success-d24-operation.page';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SuccessD24OperationPage
  }
];

@NgModule({
  imports: [
    SharedRampsModule, RouterModule.forChild(routes)
  ],
  declarations: [SuccessD24OperationPage]
})
export class SuccessD24OperationPageModule {}
