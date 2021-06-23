import { NgModule } from '@angular/core';

import { InformationPaxfulPage } from './information-paxful.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: InformationPaxfulPage,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [InformationPaxfulPage],
})
export class InformationPaxfulPageModule {}
