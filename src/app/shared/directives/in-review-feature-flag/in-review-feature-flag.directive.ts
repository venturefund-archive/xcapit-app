import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';
import { AppVersionInjectable } from '../../models/app-version/injectable/app-version.injectable';
import { Subscription } from 'rxjs';
import { FeatureFlagInjectable } from '../../models/feature-flag/injectable/feature-flag.injectable';

@Directive({
  selector: '[inReviewAppFeatureFlag]',
})
export class InReviewFeatureFlagDirective implements OnInit {
  subscription$: Subscription;
  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private remoteConfigService: RemoteConfigService,
    private appVersion: AppVersionInjectable,
    private featureFlag: FeatureFlagInjectable
  ) {}

  ngOnInit() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    this.subscription$ = this.remoteConfigService.initialized().subscribe((initialized) => {
      initialized && this.evaluateFeatureFlag();
    });
  }

  private async isEnabled(): Promise<boolean> {
    const inReview = this.remoteConfigService.getFeatureFlag('inReview');
    return !((await this.appVersion.create().updated()) && inReview);
  }

  private async evaluateFeatureFlag() {
    await this.featureFlag.create(this.viewContainer, this.templateRef, () => this.isEnabled()).evaluate();
    this.unsubscribe();
  }

  private unsubscribe(): void {
    this.subscription$ && this.subscription$.unsubscribe();
  }
}
