import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { ItemQuoteComponent } from './item-quote.component';
const testQuote = [
  {
    symbol: 'BTCUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'ETHUSDT',
    lastPrice: 3000,
    priceChangePercent: -0.24,
  },
];

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
      component.quote = testQuote[0];
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
    const symbolEl = fixture.debugElement.query(By.css('.symbol_group .symbol'));
    expect(symbolEl.nativeElement.innerHTML).toContain('BTC');
  });

  it('should render properly the pair', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const symbolEl = fixture.debugElement.query(By.css('.symbol_group .pair'));
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
    component.quote = testQuote[1];
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const symbolEl = fixture.debugElement.query(By.css('.negative'));
    expect(symbolEl.nativeElement.innerHTML).toContain(-0.24);
  });
});
