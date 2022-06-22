import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { ItemQuoteComponent } from './item-quote.component';
const testQuote = [
  {
    symbol: 'BTCUSDT',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'ETHUSDT',
    openPrice: 2900,
    lastPrice: 3000,
    priceChangePercent: -0.24,
  },
];

const reversedQuote = {
  symbol: 'USDTDAI',
  openPrice: 0.441,
  lastPrice: 0.416,
  priceChangePercent: -5.669,
};

describe('ItemQuoteComponent', () => {
  let component: ItemQuoteComponent;
  let fixture: ComponentFixture<ItemQuoteComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ItemQuoteComponent],
        imports: [IonicModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ItemQuoteComponent);
      component = fixture.componentInstance;
      component.quotation = testQuote[0];
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly the cuted symbol', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const symbolEl = fixture.debugElement.query(By.css('.symbol'));
    expect(symbolEl.nativeElement.innerHTML).toContain('BTC');
  });

  it('should render properly the pair', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const symbolEl = fixture.debugElement.query(By.css('.pair'));
    expect(symbolEl.nativeElement.innerHTML).toContain('/USDT');
  });

  it('should render properly the positive 24hs percent Change', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const symbolEl = fixture.debugElement.query(By.css('.positive'));
    expect(symbolEl.nativeElement.innerHTML).toContain(0.24);
  });

  it('should render properly last Price', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const symbolEl = fixture.debugElement.query(By.css('.lastPrice'));
    expect(symbolEl.nativeElement.innerHTML).toContain('$47,585.00');
  });

  it('should render properly the negative 24hs percent Change', async () => {
    component.quotation = testQuote[1];
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const symbolEl = fixture.debugElement.query(By.css('.negative'));
    expect(symbolEl.nativeElement.innerHTML).toContain(-0.24);
  });

  it('should invert pair prices and change percentage', async () => {
    component.quotation = reversedQuote;

    component.ngOnInit();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const baseEl = fixture.debugElement.query(By.css('.symbol'));
    const quoteEl = fixture.debugElement.query(By.css('.pair'));
    const priceEl = fixture.debugElement.query(By.css('.lastPrice'));
    const percentagChangeEl = fixture.debugElement.query(By.css('.positive'));

    expect(baseEl.nativeElement.innerHTML).toContain('DAI');
    expect(quoteEl.nativeElement.innerHTML).toContain('/USDT');
    expect(priceEl.nativeElement.innerHTML).toContain('$2.40');
    expect(percentagChangeEl.nativeElement.innerHTML).toContain('+6.01%');
  });
});
