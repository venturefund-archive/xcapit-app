import { NgModule } from '@angular/core';
import { SuccessPaxfulPage } from './success-paxful.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SuccessPaxfulPage,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [SuccessPaxfulPage],
})
export class SuccessPaxfulPageModule {}
