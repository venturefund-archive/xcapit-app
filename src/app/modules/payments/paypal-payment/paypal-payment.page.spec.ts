import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { PaypalPaymentPage } from './paypal-payment.page';

describe('PaypalPaymentPage', () => {
  let component: PaypalPaymentPage;
  let fixture: ComponentFixture<PaypalPaymentPage>;
  let navControllerSpy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaypalPaymentPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaypalPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when openBrowser is called', () => {
    spyOn(window, 'open');
    component.openBrowser();
    expect(window.open).toHaveBeenCalledTimes(1);
  });
});
