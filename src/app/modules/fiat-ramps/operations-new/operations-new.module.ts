import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsNewPage } from './operations-new.page';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: OperationsNewPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [OperationsNewPage],
})
export class OperationsNewPageModule {}
