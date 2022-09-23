import { NgModule } from '@angular/core';
import { ErrorD24OperationPage } from './error-d24-operation.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
const routes: Routes = [
  {
    path: '',
    component: ErrorD24OperationPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [ErrorD24OperationPage],
})
export class ErrorD24OperationPageModule {}
