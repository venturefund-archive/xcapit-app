import { Component } from '@angular/core';
import { CurrencyPercentagePipe } from './currency-percentage.pipe';
import { ComponentFixture, TestBed } from '@angular/core/testing';

const mockData = [
  {
    fund: { currency: 'BTC' },
    status: { porcentaje_btc: 3.4, porcentaje_usd: 4.3 }
  },
  {
    fund: { currency: 'USDT' },
    status: { porcentaje_btc: 3.4, porcentaje_usd: 4.3 }
  }
];

describe('CurrencyPercentagePipe', () => {
  const pipe = new CurrencyPercentagePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Shallow pipe test', () => {
    @Component({
      template: `
        Porcentaje: {{ this.fundStatus | currencyPercentage }}
      `
    })
    class TestComponent {
      fundStatus: any;
    }

    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let el: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, CurrencyPercentagePipe]
      });
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      el = fixture.nativeElement;
    });

    it('shoud return BTC percentage', () => {
      component.fundStatus = mockData[0];
      fixture.detectChanges();
      expect(el.textContent).toContain('Porcentaje: 3.4');
    });

    it('shoud return USD percentage', () => {
      component.fundStatus = mockData[1];
      fixture.detectChanges();
      expect(el.textContent).toContain('Porcentaje: 4.3');
    });
  });

  describe('Isolate pipe test', () => {
    it('shoud return BTC percentage', () => {
      expect(pipe.transform(mockData[0])).toBe(3.4);
    });

    it('shoud return USD percentage', () => {
      expect(pipe.transform(mockData[1])).toBe(4.3);
    });
  });
});
