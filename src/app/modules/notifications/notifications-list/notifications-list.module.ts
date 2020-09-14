import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsListPage } from './notifications-list.page';
import { SharedNotificationsModule } from '../shared-notifications/shared-notifications.module';
import { SkeletonNotificationItemComponent } from './components/skeleton-notification-item/skeleton-notification-item.component';
import { NotificationItemComponent } from './components/notification-item/notification-item.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationsListPage
  }
];

@NgModule({
  imports: [SharedNotificationsModule, RouterModule.forChild(routes)],
  declarations: [
    NotificationsListPage,
    SkeletonNotificationItemComponent,
    NotificationItemComponent
  ]
})
export class NotificationsListPageModule {}
