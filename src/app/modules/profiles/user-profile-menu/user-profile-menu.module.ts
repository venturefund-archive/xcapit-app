import { NgModule } from '@angular/core';
import { UserProfileMenuPage } from './user-profile-menu.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';
import { CardCategoryMenuComponent } from '../shared-profiles/components/card-category-menu/card-category-menu.component';
import { SharedReferralsModule } from '../../referrals/shared-referrals/shared-referrals.module';
import { UserProfileCardComponent } from '../shared-profiles/components/user-profile-card/user-profile-card.component';
import { LogOutModalComponent } from '../shared-profiles/components/log-out-modal/log-out-modal.component';

const routes: Routes = [
  {
    path: '',
    component: UserProfileMenuPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedProfilesModule, SharedReferralsModule],
  declarations: [UserProfileMenuPage, CardCategoryMenuComponent, UserProfileCardComponent, LogOutModalComponent],
})
export class UserProfileMenuPageModule {}
