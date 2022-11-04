import { ViewContainerRef, TemplateRef } from '@angular/core';
import DefaultFeatureFlag from './default-feature-flag';

describe('DefaultFeatureFlag', () => {
  let featureFlag: DefaultFeatureFlag;
  let viewContainerRefSpy: jasmine.SpyObj<ViewContainerRef>;
  let templateRefSpy: jasmine.SpyObj<TemplateRef<any>>;

  beforeEach(() => {
    viewContainerRefSpy = jasmine.createSpyObj('ViewContainerRef', {
      createEmbeddedView: null,
      clear: null,
    });
    featureFlag = new DefaultFeatureFlag(viewContainerRefSpy, templateRefSpy, () => Promise.resolve(true));
  });

  it('new', () => {
    expect(featureFlag).toBeTruthy();
  });

  it('evaluate when enabled condition returns true', async () => {
    await featureFlag.evaluate();
    expect(viewContainerRefSpy.createEmbeddedView).toHaveBeenCalledTimes(1);
  });

  it('evaluate when enabled condition returns false', async () => {
    featureFlag = new DefaultFeatureFlag(viewContainerRefSpy, templateRefSpy, () => Promise.resolve(false));
    await featureFlag.evaluate();
    expect(viewContainerRefSpy.clear).toHaveBeenCalledTimes(1);
  });
});
