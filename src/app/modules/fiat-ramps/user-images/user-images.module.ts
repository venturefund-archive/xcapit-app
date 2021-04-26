import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserImagesPage } from './user-images.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: UserImagesPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserImagesPage]
})
export class UserImagesPageModule {}
