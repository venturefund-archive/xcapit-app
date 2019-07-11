import { CurrencyTextPipe } from './currency-text.pipe';
import { Currency } from '../../enums/currency.enum';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('CurrencyTextPipe', () => {
  const pipe = new CurrencyTextPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Shallow pipe test', () => {
    @Component({
      template: `
        Currency: {{ this.currency | currencyText }}
      `
    })
    class TestComponent {
      currency: string;
    }

    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let el: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, CurrencyTextPipe]
      });
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      el = fixture.nativeElement;
    });

    it('shoud return BTC', () => {
      component.currency = Currency.BTC;
      fixture.detectChanges();
      expect(el.textContent).toContain('Currency: BTC');
    });

    it('shoud return USD', () => {
      component.currency = Currency.USDT;
      fixture.detectChanges();
      expect(el.textContent).toContain('Currency: USD');
    });
  });

  describe('Isolate pipe test', () => {
    it('shoud return BTC', () => {
      expect(pipe.transform(Currency.BTC)).toBe(Currency.BTC);
    });

    it('shoud return USD', () => {
      expect(pipe.transform(Currency.USDT)).toBe(Currency.USD);
    });
  });
});
