import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CoinContentItemComponent } from './coin-content-item.component';
import { FormattedNetworkPipe } from 'src/app/shared/pipes/formatted-network-name/formatted-network.pipe';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CoinContentItemComponent', () => {
  let component: CoinContentItemComponent;
  let fixture: ComponentFixture<CoinContentItemComponent>;

  const data = {
    imgRoute: '/assets/img/countries/argentina.svg',
    currencyOut: 'ARS',
    network: 'MATIC',
    amount: 5000,
    quoteAmount: 20,
    currencyIn: 'USDC'
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CoinContentItemComponent, FormattedNetworkPipe, FormattedAmountPipe],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CoinContentItemComponent);
    component = fixture.componentInstance;
    component.imgRoute = data.imgRoute;
    component.currencyOut = data.currencyOut;
    component.network = data.network;
    component.amount = data.amount;
    component.quoteAmount = data.quoteAmount;
    component.currencyIn = data.currencyIn;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const flagEl = fixture.debugElement.query(
      By.css('div.cci__item__container__title_and_image__image_container > img')
    );
    const currencyOutTextEl = fixture.debugElement.query(
      By.css('div.cci__item__container__title_container__title > ion-text')
    );
    const badgeEl = fixture.debugElement.query(By.css('app-token-network-badge'));
    const fiatAmountEl = fixture.debugElement.query(By.css('div.cci__item__container__amount__base > ion-text'));
    const quoteAmountEl = fixture.debugElement.query(By.css('div.cci__item__container__amount__conversion > ion-text'));

    expect(flagEl.attributes.src).toContain(data.imgRoute);
    expect(currencyOutTextEl.nativeElement.innerHTML).toContain(data.currencyOut);
    expect(badgeEl.nativeElement.blockchainName).toContain('MATIC');
    expect(fiatAmountEl.nativeElement.innerHTML).toContain(data.amount);
    expect(quoteAmountEl.nativeElement.innerHTML).toContain(data.quoteAmount);
    expect(quoteAmountEl.nativeElement.innerHTML).toContain(data.currencyIn);
  });
});
