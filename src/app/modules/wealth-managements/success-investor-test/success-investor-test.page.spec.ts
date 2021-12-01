import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { SuccessInvestorTestPage } from './success-investor-test.page';

describe('SuccessInvestorTestPage', () => {
  let component: SuccessInvestorTestPage;
  let fixture: ComponentFixture<SuccessInvestorTestPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessInvestorTestPage>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      navControllerSpy.navigateForward.and.returnValue(Promise.resolve());
      navControllerSpy.navigateBack.and.returnValue(Promise.resolve());
      TestBed.configureTestingModule({
        declarations: [SuccessInvestorTestPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [UrlSerializer, { provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessInvestorTestPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Close Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Continue Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Home Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Home');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call navigateForward in continue', () => {
    const continueButton = trackClickDirectiveHelper.getByElementByName('ion-button', 'Continue');
    continueButton.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['']);
  });

  it('should call navigateBack in close', () => {
    const closeButton = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    closeButton.nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/tabs/home']);
  });

  it('should call navigateBack in goToHome', () => {
    const goToHomeButton = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Home');
    goToHomeButton.nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/tabs/home']);
  });
});
