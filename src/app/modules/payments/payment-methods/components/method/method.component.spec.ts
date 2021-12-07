import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { MethodComponent } from './method.component';
import { ApiPaymentsService } from '../../../shared-payments/services/api-payments.service';
import { of } from 'rxjs';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { BrowserService } from '../../../../../shared/services/browser/browser.service';

describe('MethodComponent', () => {
  let component: MethodComponent;
  let fixture: ComponentFixture<MethodComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<MethodComponent>;
  let apiPaymentsServiceSpy: any;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  beforeEach(
    waitForAsync(() => {
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
      apiPaymentsServiceSpy = jasmine.createSpyObj('ApiPaymentMethods', ['getPaymentMethods']);
      TestBed.configureTestingModule({
        declarations: [DummyComponent, MethodComponent, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [HttpClientTestingModule, TranslateModule.forRoot(), IonicModule, RouterTestingModule],
        providers: [{ provide: BrowserService, useValue: browserServiceSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(MethodComponent);
      component = fixture.componentInstance;
      component.paymentMethod = { link: 'testlink', name: 'Mercadopago' };
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      apiPaymentsServiceSpy = TestBed.inject(ApiPaymentsService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when openLink is called and status is active', () => {
    const spyPaymentsService = spyOn(apiPaymentsServiceSpy, 'getPaymentLink');
    spyPaymentsService.and.returnValue(of({ link: 'http://google.com.ar' }));
    component.paymentMethod.status = 'active';
    fixture.detectChanges();
    component.openLink('1', '2');
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'http://google.com.ar' });
  });

  it('should not call window.open when openLink is called and status is not active', () => {
    component.paymentMethod.status = 'soon';
    const spy = spyOn(window, 'open');
    fixture.detectChanges();
    component.openLink('1', '2');
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call trackEvent on trackService when method is clicked', () => {
    spyOn(window, 'open');
    const el = trackClickDirectiveHelper.getByElementByName('div', 'Payment Method Select');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent').and.returnValue(null);
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
