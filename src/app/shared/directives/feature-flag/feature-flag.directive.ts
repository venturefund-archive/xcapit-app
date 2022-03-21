import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';

@Directive({
  selector: '[appFeatureFlag]',
})
export class FeatureFlagDirective {
  @Input() appFeatureFlag: string;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private remoteConfigService: RemoteConfigService,
  ) {}

  ngOnInit() {
    this.viewContainer.clear();
    if (this.remoteConfigService.getFeatureFlag(this.appFeatureFlag)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
