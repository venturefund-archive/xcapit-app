import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CardCategoryMenuComponent } from './components/card-category-menu/card-category-menu.component';
import { LogOutModalComponent } from './components/log-out-modal/log-out-modal.component';
import { UserProfileCardComponent } from './components/user-profile-card/user-profile-card.component';
import { RemoveAccountModalComponent } from './components/remove-account-modal/remove-account-modal.component';

@NgModule({
  declarations: [
    CardCategoryMenuComponent,
    UserProfileCardComponent,
    LogOutModalComponent,
    RemoveAccountModalComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    CardCategoryMenuComponent,
    UserProfileCardComponent,
    LogOutModalComponent,
    RemoveAccountModalComponent,
  ],
})
export class SharedProfilesModule {}
