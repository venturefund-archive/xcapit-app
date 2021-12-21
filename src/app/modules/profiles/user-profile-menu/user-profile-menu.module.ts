import { NgModule } from '@angular/core';
import { UserProfileMenuPage } from './user-profile-menu.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';
import { CardCategoryMenuComponent } from '../shared-profiles/components/card-category-menu/card-category-menu.component';

const routes: Routes = [
  {
    path: '',
    component: UserProfileMenuPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedProfilesModule],
  declarations: [UserProfileMenuPage, CardCategoryMenuComponent],
})
export class UserProfileMenuPageModule {}
