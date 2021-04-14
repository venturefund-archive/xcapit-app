import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyAmountValueComponent } from './currency-amount-value.component';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyTextPipe } from '../../pipes/currency-text/currency-text.pipe';

describe('CurrencyAmountValueComponent', () => {
  let component: CurrencyAmountValueComponent;
  let fixture: ComponentFixture<CurrencyAmountValueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ CurrencyAmountValueComponent, CurrencyTextPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyAmountValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
