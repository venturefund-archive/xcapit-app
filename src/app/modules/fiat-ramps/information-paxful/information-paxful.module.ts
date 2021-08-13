import { NgModule } from '@angular/core';
import { InformationPaxfulPage } from './information-paxful.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: InformationPaxfulPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [InformationPaxfulPage],
})
export class InformationPaxfulPageModule {}
