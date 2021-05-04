import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PaypalPaymentPage } from './paypal-payment.page';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';

describe('PaypalPaymentPage', () => {
  let component: PaypalPaymentPage;
  let fixture: ComponentFixture<PaypalPaymentPage>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [PaypalPaymentPage],
        imports: [IonicModule, TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(PaypalPaymentPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when openBrowser is called', () => {
    spyOn(window, 'open');
    component.openBrowser();
    expect(window.open).toHaveBeenCalledTimes(1);
  });
});
