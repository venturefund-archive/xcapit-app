import { NgModule } from '@angular/core';
import { SecurityConfigurationPage } from './security-configuration.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedUsersModule } from '../../users/shared-users/shared-users.module';

const routes: Routes = [
  {
    path: '',
    component: SecurityConfigurationPage,
  },
];

@NgModule({
  imports: [SharedUsersModule, RouterModule.forChild(routes)],
  declarations: [SecurityConfigurationPage]
})
export class SecurityConfigurationPageModule {}
