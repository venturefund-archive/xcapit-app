import { Injectable } from '@angular/core';
import { ApiSubscriptionsService } from '../api-subscriptions/api-subscriptions.service';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  constructor(
    private apiSubscriptions: ApiSubscriptionsService,
    private shareService: ShareService,
    private translate: TranslateService
  ) {}

  shareSubscriptionLink(fundName: string) {
    this.apiSubscriptions
      .getSubscriptionLink(fundName)
      .subscribe((data: any) =>
        this.shareService.share({
          title: this.translate.instant('subscriptions.subscriptions_service.share_title'),
          text: this.translate.instant('subscriptions.subscriptions_service.share_text'),
          url: data.link })
      );
  }
}
