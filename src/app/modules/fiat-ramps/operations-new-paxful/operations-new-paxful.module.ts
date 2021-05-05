import { NgModule } from '@angular/core';
import { OperationsNewPaxfulPage } from './operations-new-paxful.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: OperationsNewPaxfulPage,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [OperationsNewPaxfulPage],
})
export class OperationsNewPaxfulPageModule {}
