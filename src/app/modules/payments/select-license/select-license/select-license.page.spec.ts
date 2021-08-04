import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from '../../../../../testing/spies/nav-controller-mock.spec';
import { ApiPaymentsService } from '../../shared-payments/services/api-payments.service';
import { SelectLicensePage } from './select-license.page';
import { of } from 'rxjs';

describe('SelectLicensePage', () => {
  let component: SelectLicensePage;
  let fixture: ComponentFixture<SelectLicensePage>;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SelectLicensePage>;
  let apiPaymentsServiceSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

      apiPaymentsServiceSpy = {
        registerLicense: () => of({}),
        getSubscriptionPlans: () => of([{ frequency_type: 'months' }]),
      };

      TestBed.configureTestingModule({
        declarations: [SelectLicensePage, TrackClickDirective],
        imports: [IonicModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ApiPaymentsService, useValue: apiPaymentsServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectLicensePage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );
  beforeEach(() => {
    apiPaymentsServiceSpy = TestBed.inject(ApiPaymentsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when anual button is clicked', () => {
    spyOn(component, 'changePlans');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'anual');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when mensual button is clicked', () => {
    spyOn(component, 'changePlans');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'mensual');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call changePlans on ionViewWillEnter', async (done) => {
    const spy = spyOn(component, 'changePlans');
    component.ionViewWillEnter();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });

  it('should call activatedBtn on changeLicenses on ionViewWillEnter', () => {
    const spy = spyOn(component, 'activatedBtn');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  [true, false].forEach((p) => {
    it(`when activatedBtn is called with ${p} parameter`, () => {
      const stateAnnual = p ? 'active' : '';
      const stateMonthly = !p ? 'active' : '';
      component.activatedBtn(p);
      expect(component.activeButtonAnnual).toBe(p);
      expect(component.stateAnnual).toBe(stateAnnual);
      expect(component.activeButtonMonthly).toBe(!p);
      expect(component.stateMonthly).toBe(stateMonthly);
    });
  });

  it('should call registerLicense and getSuccess route on action with free license', () => {
    const spy = spyOn(apiPaymentsServiceSpy, 'registerLicense');
    const spyGetSucessRoute = spyOn(component, 'getSuccessRoute');
    component.selectedPlan = 'free';
    spy.and.returnValue(of({}));
    spyGetSucessRoute.and.returnValue(Promise.resolve(true));
    component.action(component.selectedPlan, '1');
    expect(apiPaymentsServiceSpy.registerLicense).toHaveBeenCalledTimes(1);
    expect(component.getSuccessRoute).toHaveBeenCalledTimes(1);
  });

  it('should call registerLicense and getSuccess route on action with paid license', () => {
    const spy = spyOn(component, 'getPaymentRoute');
    component.selectedPlan = 'paid';
    spy.and.returnValue(Promise.resolve(true));
    component.action(component.selectedPlan, '2');
    expect(component.getPaymentRoute).toHaveBeenCalledTimes(1);
  });

  it('should call navigateForward with ["/payment/payment-success"] on navController when getSuccessRoute is called', () => {
    component.getSuccessRoute();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/payment/payment-success']);
  });

  it('should call navigateForward with ["/payment/payment-methods", plan_id] on navController when getPaymentRoute is called', () => {
    component.getPaymentRoute('2');
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/payment/payment-methods', '2']);
  });
});
