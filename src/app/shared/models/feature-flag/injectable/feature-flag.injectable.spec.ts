import { ViewContainerRef, TemplateRef } from '@angular/core';
import DefaultFeatureFlag from '../default/default-feature-flag';
import { FeatureFlagInjectable } from './feature-flag.injectable';

describe('FeatureFlagInjectable', () => {
  let featureFlagInjectable: FeatureFlagInjectable;
  let viewContainerRefSpy: jasmine.SpyObj<ViewContainerRef>;
  let templateRefSpy: jasmine.SpyObj<TemplateRef<any>>;

  beforeEach(() => {
    featureFlagInjectable = new FeatureFlagInjectable();
  });
  it('new', () => {
    expect(featureFlagInjectable).toBeTruthy();
  });

  it('create', () => {
    expect(
      featureFlagInjectable.create(viewContainerRefSpy, templateRefSpy, () => Promise.resolve(true))
    ).toBeInstanceOf(DefaultFeatureFlag);
  });
});
