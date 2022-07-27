import { NgModule } from '@angular/core';
import { UserProfileMenuPage } from './user-profile-menu.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';
import { SharedReferralsModule } from '../../referrals/shared-referrals/shared-referrals.module';

const routes: Routes = [
  {
    path: '',
    component: UserProfileMenuPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedProfilesModule, SharedReferralsModule],
  declarations: [UserProfileMenuPage],
})
export class UserProfileMenuPageModule {}
