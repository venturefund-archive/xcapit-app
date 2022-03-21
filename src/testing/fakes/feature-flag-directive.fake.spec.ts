import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Directive({
  selector: '[appFeatureFlag]',
  providers: [
    {
      provide: RemoteConfigService,
      useValue: { getFeatureFlag: (param) => true, initialize: () => Promise.resolve() },
    },
  ],
})
export class FakeFeatureFlagDirective {
  @Input() appFeatureFlag: string;

  constructor(private viewContainer: ViewContainerRef, private templateRef: TemplateRef<any>) {}
}
