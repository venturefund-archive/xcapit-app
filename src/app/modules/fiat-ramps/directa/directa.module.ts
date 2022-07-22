import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { DirectaPage } from './directa.page';

const routes: Routes = [
  {
    path: '',
    component: DirectaPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [DirectaPage]
})
export class DirectaPageModule {}
