import { CurrencyFormatPipe } from './currency-format.pipe';
import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('CurrencyFormatPipe', () => {
  const pipe = new CurrencyFormatPipe(new DecimalPipe('es'));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Shallow pipe test', () => {
    @Component({
      template: `{{ this.value | currencyFormat : { currency: this.currency, formatUSDT: '1.2-2', formatBTC: '1.2-4' } }}`,
    })
    class TestComponent {
      value: number;
      currency: string;
    }

    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let el: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, CurrencyFormatPipe],
        providers: [DecimalPipe]
      });
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      el = fixture.nativeElement;
    });

    it('shoud return 4 decimals and BTC', () => {
      component.value = 0.034527845;
      component.currency = 'BTC';
      fixture.detectChanges();
      expect(el.textContent).toBe('0.0345 BTC');
    });

    it('shoud return 2 decimals and USDT', () => {
      component.value = 323.2332345;
      component.currency = 'USDT';
      fixture.detectChanges();
      expect(el.textContent).toBe('323.23 USDT');
    });
  });
});
