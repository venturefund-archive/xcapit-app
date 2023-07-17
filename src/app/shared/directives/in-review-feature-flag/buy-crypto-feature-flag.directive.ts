import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';
import { AppVersionInjectable } from '../../models/app-version/injectable/app-version.injectable';
import { FeatureFlagInjectable } from '../../models/feature-flag/injectable/feature-flag.injectable';
import { DefaultPlatformService } from '../../services/platform/default/default-platform.service';

@Directive({
  selector: '[appBuyCryptoFeatureFlag]',
})
export class BuyCryptoFeatureFlagDirective implements OnInit {
  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private remoteConfigService: RemoteConfigService,
    private appVersion: AppVersionInjectable,
    private featureFlag: FeatureFlagInjectable,
    private platform: DefaultPlatformService
  ) {}

  ngOnInit() {
    this.evaluateFeatureFlag();
  }

  private async isEnabled(): Promise<boolean> {
    let enabled = this.remoteConfigService.getFeatureFlag('ff_buyCrypto');

    if (this.platform.isNative()) {
      const inReview = this.remoteConfigService.getFeatureFlag('inReview');
      enabled = !((await this.appVersion.create().updated()) && inReview);
    }
    return enabled;
  }

  private async evaluateFeatureFlag() {
    await this.featureFlag.create(this.viewContainer, this.templateRef, () => this.isEnabled()).evaluate();
  }
}
