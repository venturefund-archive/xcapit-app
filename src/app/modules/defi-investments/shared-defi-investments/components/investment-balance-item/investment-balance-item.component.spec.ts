import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { InvestmentBalanceItemComponent } from './investment-balance-item.component';

const testActiveInvestments = {
  logo:'assets/img/coins/USDC.svg',
  symbol: 'USDC',
  description: 'USD Coin',
  liquidity: 20,
  balance: 0.0005621,
  convertedBalance: 50,
};

describe('InvestmentBalanceItemComponent', () => {
  let component: InvestmentBalanceItemComponent;
  let fixture: ComponentFixture<InvestmentBalanceItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentBalanceItemComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentBalanceItemComponent);
    component = fixture.componentInstance;
    component.activeProduct = testActiveInvestments;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render symbol properly', () => {
    const symbolEl = fixture.debugElement.query(By.css('div.ibi__content__group  .symbol'));
    expect(symbolEl.nativeElement.innerHTML).toContain('USDC');
  });

  it('should render balance properly', () => {
    const balanceEl = fixture.debugElement.query(By.css('div.ibi__content__group  .balance'));
    expect(balanceEl.nativeElement.innerHTML).toContain(0.0005621);
  });

    it('should render description properly', () => {
    const descriptionEl = fixture.debugElement.query(By.css('div.ibi__content__group  .description'));
    expect(descriptionEl.nativeElement.innerHTML).toContain('USD Coin');
  });

  it('should render converted-balance properly', () => {
    const convertedBalanceEl = fixture.debugElement.query(By.css('div.ibi__content__group  .converted-balance'));
    expect(convertedBalanceEl.nativeElement.innerHTML).toContain(50);
  });


  it('should render image properly', () => {
    const imageEl = fixture.debugElement.query(By.css('.ibi__image .ibi__image__img'));
    expect(imageEl.attributes.src).toContain('assets/img/coins/USDC.svg');
  });
  
});

