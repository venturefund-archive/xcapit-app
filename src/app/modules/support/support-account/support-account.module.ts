import { NgModule } from '@angular/core';
import { SupportAccountPage } from './support-account.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';

const routes: Routes = [
  {
    path: '',
    component: SupportAccountPage,
  },
];

@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  declarations: [SupportAccountPage],
})
export class SupportAccountPageModule {}
