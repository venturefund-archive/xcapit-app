import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserImagesPage } from './user-images.page';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: UserImagesPage
  }
];

@NgModule({
  imports: [
    SharedRampsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserImagesPage]
})
export class UserImagesPageModule {}
