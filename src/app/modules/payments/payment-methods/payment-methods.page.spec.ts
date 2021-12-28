import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PaymentMethodsPage } from './payment-methods.page';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { ApiPaymentsService } from '../shared-payments/services/api-payments.service';
import { of } from 'rxjs';

describe('PaymentMethodsPage', () => {
  let component: PaymentMethodsPage;
  let fixture: ComponentFixture<PaymentMethodsPage>;
  let navControllerSpy: any;
  let apiPaymentsServiceSpy: any;
  let activatedRouteSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      apiPaymentsServiceSpy = jasmine.createSpyObj('ApiPaymentMethods', ['getPaymentMethods']);

      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
      activatedRouteSpy.snapshot = {
        paramMap: convertToParamMap({
          plan_id: '2',
        }),
      };
      TestBed.configureTestingModule({
        declarations: [PaymentMethodsPage],
        imports: [TranslateModule.forRoot(), IonicModule, HttpClientTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
        ],
      }).compileComponents();

      apiPaymentsServiceSpy = TestBed.inject(ApiPaymentsService);

      fixture = TestBed.createComponent(PaymentMethodsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPaymentMethods of apiPaymentsServices on ionViewWillEnter', () => {
    const spy = spyOn(apiPaymentsServiceSpy, 'getPaymentMethods');
    spy.and.returnValue(
      of([
        {
          id: 1,
          name: 'Mercadopago',
          description: 'payment.methods.arg',
        },
      ])
    );
    component.ionViewWillEnter();
    expect(apiPaymentsServiceSpy.getPaymentMethods).toHaveBeenCalledTimes(1);
  });
});
