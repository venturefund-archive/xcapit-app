import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
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
  ) {}

  ngOnInit() {
    this.checkIfRemoteConfigIsInitialized();
  }

  private createView() {
    if (this.getFeatureFlag()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkIfRemoteConfigIsInitialized() {
    if (this.remoteConfigService.isInitialized) {
      this.createView();
    } else {
      this.remoteConfigService.initializationCompleteEvent.subscribe(() => {
        this.createView();
      })
    }
  }

  private getFeatureFlag() {
    const featureFlag = this.remoteConfigService.getFeatureFlag(this.appFeatureFlag)
    return this.appFeatureFlagNegated? !featureFlag : featureFlag
  }
}
