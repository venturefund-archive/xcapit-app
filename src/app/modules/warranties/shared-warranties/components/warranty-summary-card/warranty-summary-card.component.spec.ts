import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { rawUSDCData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { SummaryWarrantyData } from 'src/app/modules/warranties/send-warranty/interfaces/summary-warranty-data.interface';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { FormattedNetworkPipe } from 'src/app/shared/pipes/formatted-network-name/formatted-network.pipe';
import { WarrantySummaryCardComponent } from './warranty-summary-card.component';

describe('WarrantySummaryCardComponent', () => {
  let component: WarrantySummaryCardComponent;
  let fixture: ComponentFixture<WarrantySummaryCardComponent>;
  const summaryData: SummaryWarrantyData = {
    amount: 10,
    coin: rawUSDCData,
    user_dni: 1234567,
    quoteAmount: 10,
    quoteAmountWithoutCost: 9.8,
    service_cost: 0.2,
    amountWithoutCost: 9.8,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WarrantySummaryCardComponent, FormattedAmountPipe, FormattedNetworkPipe],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WarrantySummaryCardComponent);
    component = fixture.componentInstance;
    component.warrantyData = summaryData;
    component.title = 'warranties.summary.title';
    component.documentTitle = 'warranties.summary.dniLabel';
    component.amountTitle = 'warranties.summary.amountLabel';
    component.serviceCost = 'warranties.summary.serviceLabel';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const titleEl = fixture.debugElement.query(By.css('div.wsc__title > ion-text'));
    const nameIconCoinEl = fixture.debugElement.query(By.css('div.wsc__item__container__title_and_image'));
    const amountEl = fixture.debugElement.query(By.css('div.wsc__item__container__amount > div > ion-text'));
    const quoteAmountEl = fixture.debugElement.query(By.css('div.wsc__item__container__amount__conversion > ion-text'));
    const dniTitleEl = fixture.debugElement.query(By.css('div.wsc__item__title__dni > ion-text'));
    const dniNumberEl = fixture.debugElement.query(By.css('div.wsc__item__content__dni > ion-text'));
    const amountTitleEl = fixture.debugElement.query(By.css('div.wsc__item__title__amount > ion-text'));
    const [amountWithoutCostEl, quoteAmountWithoutCostEl] = fixture.debugElement.queryAll(By.css('div.wsc__item__content__amount > ion-text'));
    const serviceCostEl = fixture.debugElement.query(By.css('div.wsc__item__title__service-cost > ion-text'));
    const amountServiceCostEl = fixture.debugElement.query(By.css('div.wsc__item__content__amount-service-cost > ion-text'));
    expect(titleEl.nativeElement.innerHTML).toContain('warranties.summary.title');
    expect(nameIconCoinEl).toBeTruthy();
    expect(amountEl.nativeElement.innerHTML).toContain('10 USDC');
    expect(quoteAmountEl.nativeElement.innerHTML).toContain('= 10 USD');
    expect(dniTitleEl.nativeElement.innerHTML).toContain('warranties.summary.dniLabel');
    expect(dniNumberEl.nativeElement.innerHTML).toContain('1234567');
    expect(amountTitleEl.nativeElement.innerHTML).toContain('warranties.summary.amountLabel');
    expect(amountWithoutCostEl.nativeElement.innerHTML).toContain('9.8 USDC');
    expect(quoteAmountWithoutCostEl.nativeElement.innerHTML).toContain('9.8 USD');
    expect(serviceCostEl.nativeElement.innerHTML).toContain('warranties.summary.serviceLabel');
    expect(amountServiceCostEl.nativeElement.innerHTML).toContain('0.2 USDC');
  });
});
