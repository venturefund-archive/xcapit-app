import { Component, CUSTOM_ELEMENTS_SCHEMA, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';
import { FeatureFlagDirective } from './feature-flag.directive';

@Component({
  template: `
    <div *appFeatureFlag="'test'">
      <p id="HiddenFeature">Test component</p>
    </div>
  `,
})
class TestComponent {}

fdescribe('FeatureFlagDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(
    waitForAsync(() => {
      remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
        getFeatureFlag: true,
      });

      TestBed.configureTestingModule({
        declarations: [TestComponent, FeatureFlagDirective],
        providers: [{ provide: RemoteConfigService, useValue: remoteConfigServiceSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
    })
  );

  it('should create an instance of the component', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should hide element when remote config service returns false', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('#HiddenFeature'));
    expect(textEl).toBeFalsy();
  });

  it('should show element when remote config service returns true', async () => {
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('#HiddenFeature'));
    expect(textEl).toBeTruthy();
  });
});
