import { NgModule } from '@angular/core';
import { UserProfileMenuPage } from './user-profile-menu.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';

const routes: Routes = [
  {
    path: '',
    component: UserProfileMenuPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedProfilesModule],
  declarations: [UserProfileMenuPage],
})
export class UserProfileMenuPageModule {}
