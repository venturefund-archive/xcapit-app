import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FeatureFlagInjectable } from '../../models/feature-flag/injectable/feature-flag.injectable';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';

@Directive({
  selector: '[appFeatureFlag]',
})
export class FeatureFlagDirective implements OnInit {
  subscription$: Subscription;
  @Input() appFeatureFlag: string;
  @Input() appFeatureFlagNegated = false;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private remoteConfigService: RemoteConfigService,
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

  private isEnabled() {
    const featureFlag = this.remoteConfigService.getFeatureFlag(this.appFeatureFlag);
    return this.appFeatureFlagNegated ? !featureFlag : featureFlag;
  }

  private async evaluateFeatureFlag() {
    await this.featureFlag.create(this.viewContainer, this.templateRef, () => this.isEnabled()).evaluate();
    this.unsubscribe();
  }

  private unsubscribe(): void {
    this.subscription$ && this.subscription$.unsubscribe();
  }
}
