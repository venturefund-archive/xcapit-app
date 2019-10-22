import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationPage } from './notification.page';
import { SharedNotificationsModule } from '../shared-notifications/shared-notifications.module';

const routes: Routes = [
  {
    path: ':id',
    component: NotificationPage
  }
];

@NgModule({
  imports: [
    SharedNotificationsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NotificationPage]
})
export class NotificationPageModule {}
