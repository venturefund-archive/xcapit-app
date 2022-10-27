import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';
import { InReviewFeatureFlagDirective } from './in-review-feature-flag.directive';
import { AppVersionInjectable } from '../../models/app-version/injectable/app-version.injectable';
import { FakeAppVersion } from '../../models/app-version/fake/fake-app-version';
import { AppVersion } from '../../models/app-version/app-version.interface';
@Component({
  template: `
    <div *inReviewAppFeatureFlag>
      <p id="HiddenFeature">Test component</p>
    </div>
  `,
})
class TestComponent {
  isNegated = false;
}

describe('InReviewFeatureFlagDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let appVersionInjectableSpy: jasmine.SpyObj<AppVersionInjectable>;
  let fakeAppVersion: AppVersion;

  beforeEach(waitForAsync(() => {
    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getFeatureFlag: true,
    });

    fakeAppVersion = new FakeAppVersion(Promise.resolve('3.0.0'), '3.0.1', Promise.resolve(false));

    appVersionInjectableSpy = jasmine.createSpyObj('AppVersionInjectable', {
      create: fakeAppVersion,
    });

    TestBed.configureTestingModule({
      declarations: [TestComponent, InReviewFeatureFlagDirective],
      providers: [
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
        { provide: AppVersionInjectable, useValue: appVersionInjectableSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
  }));

  it('should create an instance of the component', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should hide element when app is in review and updated', async () => {
    fakeAppVersion = new FakeAppVersion(Promise.resolve('3.0.1'), '3.0.1', Promise.resolve(true));
    appVersionInjectableSpy.create.and.returnValue(fakeAppVersion);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const textEl = fixture.debugElement.query(By.css('#HiddenFeature'));
    expect(textEl).toBeFalsy();
  });

  it('should show element when app is in review but is not updated', async () => {
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const textEl = fixture.debugElement.query(By.css('#HiddenFeature'));
    expect(textEl.nativeElement.textContent.trim()).toEqual('Test component');
  });

  it('should show element when app isnt in review and is updated', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    fakeAppVersion = new FakeAppVersion(Promise.resolve('3.0.1'), '3.0.1', Promise.resolve(true));
    appVersionInjectableSpy.create.and.returnValue(fakeAppVersion);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const textEl = fixture.debugElement.query(By.css('#HiddenFeature'));
    expect(textEl.nativeElement.textContent.trim()).toEqual('Test component');
  });
});
