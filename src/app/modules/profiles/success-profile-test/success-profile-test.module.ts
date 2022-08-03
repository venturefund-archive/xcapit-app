import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';
import { SuccessProfileTestPage } from './success-profile-test.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessProfileTestPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedProfilesModule],
  declarations: [SuccessProfileTestPage]
})
export class SuccessProfileTestPageModule {}
