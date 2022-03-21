import { ViewContainerRef } from '@angular/core';
import { fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';
import { FeatureFlagDirective } from './feature-flag.directive';

fdescribe('FeatureFlagDirective', () => {
  let directive: FeatureFlagDirective;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let viewContainerRefSpy: jasmine.SpyObj<ViewContainerRef>;
  const templateRefMock: any = {};

  beforeEach(
    waitForAsync(() => {
      remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
        get: Promise.resolve(false),
      });

      viewContainerRefSpy = jasmine.createSpyObj('ViewContainerRef', {
        createEmbeddedView: {},
        clear: null,
      });

      directive = new FeatureFlagDirective(viewContainerRefSpy, templateRefMock, remoteConfigServiceSpy);
    })
  );

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should hide element when remote config service returns false', fakeAsync(() => {
    directive.ngOnInit();
    tick(10);
    expect(viewContainerRefSpy.clear).toHaveBeenCalledTimes(1);
    expect(viewContainerRefSpy.createEmbeddedView).not.toHaveBeenCalled();
  }));

  it('should show element when remote config service returns true', fakeAsync(() => {
    remoteConfigServiceSpy.get.and.returnValue(Promise.resolve(true));
    directive.ngOnInit();
    tick(10);
    expect(viewContainerRefSpy.clear).toHaveBeenCalledTimes(1);
    expect(viewContainerRefSpy.createEmbeddedView).toHaveBeenCalledTimes(1);
  }));
});
