import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfilePage } from './user-profile.page';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';
import { ShowProfileComponent } from './components/show-profile/show-profile.component';
import { HeaderProfileComponent } from './components/header-profile/header-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

const routes: Routes = [
  {
    path: '',
    component: UserProfilePage
  }
];

@NgModule({
  imports: [SharedProfilesModule, RouterModule.forChild(routes)],
  declarations: [
    UserProfilePage,
    ShowProfileComponent,
    HeaderProfileComponent,
    EditProfileComponent
  ]
})
export class UserProfilePageModule {}
