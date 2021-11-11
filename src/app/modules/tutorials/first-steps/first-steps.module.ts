import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirstStepsPage } from './first-steps.page';
import { SharedTutorialsModule } from '../shared-tutorials/shared-tutorials.module';

const routes: Routes = [
  {
    path: '',
    component: FirstStepsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedTutorialsModule],
  declarations: [FirstStepsPage],
})
export class FirstStepsPageModule {}
