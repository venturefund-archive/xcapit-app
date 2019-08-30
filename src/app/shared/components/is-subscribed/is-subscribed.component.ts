import { Component, Input, ChangeDetectionStrategy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';

@Component({
  selector: 'app-is-subscribed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content *ngIf="this.showContent"></ng-content>`
})
export class IsSubscribedComponent implements OnChanges {
  @Input()
  redirectTo = '';

  @Input()
  fundName: string;

  @Input()
  disabled = false;

  showContent = false;

  constructor(
    private apiFunds: ApiFundsService,
    private navController: NavController,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    if (this.disabled) {
      this.showContent = true;
    } else {
      this.checkSubscription();
    }
  }

  private checkSubscription() {
    if (this.fundName) {
      this.apiFunds.isSubscribed(this.fundName).subscribe(
        res => {
          this.showContent = res.is_subscribed;
          if (!this.showContent && this.redirectTo) {
            this.redirect(this.redirectTo);
          } else {
            this.cd.markForCheck();
          }
        },
        () => this.redirect(this.redirectTo)
      );
    }
  }

  private redirect(path: string) {
    this.navController.navigateBack([path]);
  }
}
