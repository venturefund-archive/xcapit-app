import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { PaymentSuccessPage } from './payment-success.page';

describe('PaymentsSuccessPage', () => {
  let component: PaymentSuccessPage;
  let fixture: ComponentFixture<PaymentSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentSuccessPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [UrlSerializer],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
