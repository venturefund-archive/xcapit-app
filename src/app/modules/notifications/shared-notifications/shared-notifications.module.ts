import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationPipe } from './pipes/notification/notification.pipe';

@NgModule({
  declarations: [NotificationPipe],
  imports: [SharedModule],
  exports: [SharedModule, NotificationPipe]
})
export class SharedNotificationsModule { }
