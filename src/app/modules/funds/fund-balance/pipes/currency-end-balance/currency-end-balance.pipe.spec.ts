import { CurrencyEndBalancePipe } from './currency-end-balance.pipe';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

const mockData = [
  {
    fund: { currency: 'BTC' },
    balance: { balance_fin_btc: 3.4, balance_fin_usd: 4.3 }
  },
  {
    fund: { currency: 'USDT' },
    balance: { balance_fin_btc: 3.4, balance_fin_usd: 4.3 }
  },
  {
    fund: { currency: 'USDT' },
    balance: { balance_fin_btc: 3.4, balance_fin_usd: 4.3, to_ca: { ca: 'BTC', balance_fin: 2.3} }
  },
  {
    fund: { currency: 'BTC' },
    balance: { balance_fin_btc: 3.4, balance_fin_usd: 4.3, to_ca: { ca: 'USDT', balance_fin: 3.2} }
  }
];

describe('CurrencyEndBalancePipe', () => {
  const pipe = new CurrencyEndBalancePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Shallow pipe test', () => {
    @Component({
      template: `
        Balance: {{ this.fundBalance | currencyEndBalance }}
      `
    })
    class TestComponent {
      fundBalance: any;
    }

    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let el: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, CurrencyEndBalancePipe]
      });
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      el = fixture.nativeElement;
    });

    it('shoud return BTC balance fin', () => {
      component.fundBalance = mockData[0];
      fixture.detectChanges();
      expect(el.textContent).toContain('Balance: 3.4');
    });

    it('shoud return USD balance fin', () => {
      component.fundBalance = mockData[1];
      fixture.detectChanges();
      expect(el.textContent).toContain('Balance: 4.3');
    });

    it('shoud return to_ca BTC balance fin', () => {
      component.fundBalance = mockData[2];
      fixture.detectChanges();
      expect(el.textContent).toContain('Balance: 2.3');
    });

    it('shoud return to_ca USD balance fin', () => {
      component.fundBalance = mockData[3];
      fixture.detectChanges();
      expect(el.textContent).toContain('Balance: 3.2');
    });
  });

  describe('Isolate pipe test', () => {
    it('shoud return BTC balance fin', () => {
      expect(pipe.transform(mockData[0])).toBe(3.4);
    });

    it('shoud return USD balance fin', () => {
      expect(pipe.transform(mockData[1])).toBe(4.3);
    });

    it('shoud return to_ca BTC balance fin', () => {
      expect(pipe.transform(mockData[2])).toBe(2.3);
    });

    it('shoud return to_ca USDT balance fin', () => {
      expect(pipe.transform(mockData[3])).toBe(3.2);
    });
  });
});
