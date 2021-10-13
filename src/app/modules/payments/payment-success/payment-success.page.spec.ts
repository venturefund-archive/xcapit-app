import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { PaymentSuccessPage } from './payment-success.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('PaymentsSuccessPage', () => {
  let component: PaymentSuccessPage;
  let fixture: ComponentFixture<PaymentSuccessPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<PaymentSuccessPage>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      navControllerSpy.navigateForward.and.returnValue(Promise.resolve());
      navControllerSpy.navigateBack.and.returnValue(Promise.resolve());
      TestBed.configureTestingModule({
        declarations: [PaymentSuccessPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [UrlSerializer, { provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(PaymentSuccessPage);
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

  it('should call navigateForward in continue', () => {
    component.continue();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/tabs/home']);
  });

  it('should call navigateBack in close', () => {
    component.close();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/tabs/home']);
  });
});
