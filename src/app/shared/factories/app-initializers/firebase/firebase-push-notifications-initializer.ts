import { NotificationsService } from 'src/app/modules/notifications/shared-notifications/services/notifications/notifications.service';

export function firebasePushNotificationsInitializer(notificationsService: NotificationsService) {
  return () => {
    try {
      notificationsService.getInstance().init();
    } catch (error) {
      console.error(error);
    }
  };
}
