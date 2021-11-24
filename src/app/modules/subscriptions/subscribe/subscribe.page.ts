import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { filter, tap, switchMap } from 'rxjs/operators';
import { ApiSubscriptionsService } from '../shared-subscriptions/services/api-subscriptions/api-subscriptions.service';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subscribe',
  template: ` <ion-content></ion-content> `,
  styleUrls: ['./subscribe.page.scss'],
})
export class SubscribePage implements OnInit, OnDestroy {
  subscriptionToken: string;

  fundNameb64: string;

  isSubscribing = true;

  subscribeToFundSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private apiSubscription: ApiSubscriptionsService,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.subscribeToFund();
  }

  ngOnDestroy() {
    if (this.subscribeToFundSubscription) {
      this.subscribeToFundSubscription.unsubscribe();
    }
  }

  subscribeToFund() {
    this.subscribeToFundSubscription = this.route.params
      .pipe(
        filter((params: Params) => params.subscriptionToken && params.fundNameb64),
        tap((params: Params) => {
          this.subscriptionToken = params.subscriptionToken;
          this.fundNameb64 = params.fundNameb64;
        }),
        switchMap(() => this.apiSubscription.subscribeToFund(this.subscriptionToken, this.fundNameb64))
      )
      .subscribe({
        next: (data) => this.handleSubscriptionResponse(data),
        error: (error) => this.handleSubscriptionErrorResponse(error),
      });
  }

  handleSubscriptionResponse(data: any) {
    this.isSubscribing = false;
    let url: string;
    let message: string;

    if (data.isSubscribe && data.fundName) {
      url = `/funds/fund-summary/${data.fundName}`;
      message = 'subscriptions.subscribe.ok_text';
    } else {
      url = `/tabs/home`;
      message = 'subscriptions.subscribe.error_text';
    }
    this.navController
      .navigateForward([url], {
        replaceUrl: true,
      })
      .then(() =>
        this.toastService.showToast({
          message: this.translate.instant(message),
        })
      );
  }
  handleSubscriptionErrorResponse(data: any) {
    let url = `/tabs/home`;
    if (data.error.error_code && data.error.fundName) {
      url = `/funds/fund-summary/${data.error.fundName}`;
    }
    this.navController.navigateForward([url], {
      replaceUrl: true,
    });
  }
}
