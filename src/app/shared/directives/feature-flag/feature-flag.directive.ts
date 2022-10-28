import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureFlagInjectable } from '../../models/feature-flag/injectable/feature-flag.injectable';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';

@Directive({
  selector: '[appFeatureFlag]',
})
export class FeatureFlagDirective implements OnInit {
  @Input() appFeatureFlag: string;
  @Input() appFeatureFlagNegated = false;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private remoteConfigService: RemoteConfigService,
    private featureFlag: FeatureFlagInjectable
  ) {}

  ngOnInit() {
    this.evaluateFeatureFlag();
  }

  private isEnabled() {
    const featureFlag = this.remoteConfigService.getFeatureFlag(this.appFeatureFlag);
    return this.appFeatureFlagNegated ? !featureFlag : featureFlag;
  }

  private async evaluateFeatureFlag() {
    await this.featureFlag.create(this.viewContainer, this.templateRef, () => this.isEnabled()).evaluate();
  }
}
