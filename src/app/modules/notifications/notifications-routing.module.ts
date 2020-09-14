import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'notifications',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'list',
        loadChildren: () =>
          import('./notifications-list/notifications-list.module').then(
            m => m.NotificationsListPageModule
          )
      },
      {
        path: 'view',
        loadChildren: () =>
          import('./notification/notification.module').then(
            m => m.NotificationPageModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule {}
