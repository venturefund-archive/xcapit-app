import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';
import { AppVersionInjectable } from '../../models/app-version/injectable/app-version.injectable';
import { FeatureFlagInjectable } from '../../models/feature-flag/injectable/feature-flag.injectable';

@Directive({
  selector: '[inReviewAppFeatureFlag]',
})
export class InReviewFeatureFlagDirective implements OnInit {
  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private remoteConfigService: RemoteConfigService,
    private appVersion: AppVersionInjectable,
    private featureFlag: FeatureFlagInjectable
  ) {}

  ngOnInit() {
    this.evaluateFeatureFlag();
  }

  private async isEnabled(): Promise<boolean> {
    const inReview = this.remoteConfigService.getFeatureFlag('inReview');
    return !((await this.appVersion.create().updated()) && inReview);
  }

  private async evaluateFeatureFlag() {
    await this.featureFlag.create(this.viewContainer, this.templateRef, () => this.isEnabled()).evaluate();
  }
}
