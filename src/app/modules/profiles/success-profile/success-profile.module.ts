import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuccessProfilePage } from './success-profile.page';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessProfilePage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedProfilesModule
  ],
  declarations: [SuccessProfilePage]
})
export class SuccessProfilePageModule {}
