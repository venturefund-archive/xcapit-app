import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsPagePage } from './operations-page.page';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: OperationsPagePage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [OperationsPagePage],
})
export class OperationsPagePageModule {}
