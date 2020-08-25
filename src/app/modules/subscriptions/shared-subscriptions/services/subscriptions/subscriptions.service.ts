import { Injectable } from '@angular/core';
import { ApiSubscriptionsService } from '../api-subscriptions/api-subscriptions.service';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
const SUBSCRIPTION_LINK_STORAGE_KEY = 'subscriptionLink';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  constructor(
    private apiSubscriptions: ApiSubscriptionsService,
    private shareService: ShareService,
    private translate: TranslateService,
    private storage: Storage,
    private navController: NavController
  ) {}

  shareSubscriptionLink(fundName: string) {
    this.apiSubscriptions
      .getSubscriptionLink(fundName)
      .subscribe((data: any) => {
        this.shareService.share({
          title: this.translate.instant(
            'subscriptions.subscriptions_service.share_title'
          ),
          text: this.translate.instant(
            'subscriptions.subscriptions_service.share_text'
          ),
          url: data.link,
          dialogTitle: this.translate.instant(
            'subscriptions.subscriptions_service.share_title'
          )
        },
        this.translate.instant('subscriptions.subscriptions_service.toast_text_copied'));
      });
  }

  async saveLinkData(data: any): Promise<void> {
    await this.storage.set(SUBSCRIPTION_LINK_STORAGE_KEY, data);
  }

  async getStoredLink() {
    return await this.storage.get(SUBSCRIPTION_LINK_STORAGE_KEY);
  }

  removeStoredLink() {
    this.storage.remove(SUBSCRIPTION_LINK_STORAGE_KEY);
  }

  async checkStoredLink() {
    const data = await this.getStoredLink();
    let url: string[];
    if (data) {
      url = [
        '/subscriptions/subscribe',
        data.subscriptionToken,
        data.fundNameb64
      ];
      this.removeStoredLink();
      await this.navController.navigateForward(url, { replaceUrl: true });
      return true;
    }
    return false;
  }
}
