import { Injectable, ViewContainerRef, TemplateRef } from '@angular/core';
import DefaultFeatureFlag from '../default/default-feature-flag';
import { FeatureFlag } from '../feature-flag.interface';

@Injectable({ providedIn: 'root' })
export class FeatureFlagInjectable {
  create(
    viewContainer: ViewContainerRef,
    templateRef: TemplateRef<any>,
    isEnabled: () => Promise<boolean> | boolean
  ): FeatureFlag {
    return new DefaultFeatureFlag(viewContainer, templateRef, isEnabled);
  }
}
