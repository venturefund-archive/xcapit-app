import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransactionSummaryCardComponent } from './transaction-summary-card.component';
import { SummaryData } from '../../../send/send-summary/interfaces/summary-data.interface';
import { By } from '@angular/platform-browser';
const summaryData: SummaryData = {
  network: 'ERC20',
  currency: {
    id: 1,
    name: 'BTC - Bitcoin',
    logoRoute: '../../assets/img/coins/BTC.svg',
    last: false,
    value: 'BTC',
  },
  address: 'asdlkfjasd56lfjasdpodlfkj',
  amount: 1,
  referenceAmount: 50000,
};
describe('TransactionSummaryCardComponent', () => {
  let component: TransactionSummaryCardComponent;
  let fixture: ComponentFixture<TransactionSummaryCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionSummaryCardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionSummaryCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be rendered properly', async () => {
    component.summaryData = summaryData;
    component.amountsTitle = 'Test title';
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const nameAndIconEl = fixture.debugElement.query(By.css('.tsc__name-and-icon'));
    expect(nameAndIconEl.nativeElement.innerHTML).toContain('BTC - Bitcoin');
    expect(nameAndIconEl.nativeElement.innerHTML).toContain('ERC20');

    const amountEl = fixture.debugElement.query(By.css('.tsc__amount'));
    expect(amountEl.nativeElement.innerHTML).toContain('Test title');
    expect(amountEl.nativeElement.innerHTML).toContain('1 BTC');
    expect(amountEl.nativeElement.innerHTML).toContain('50000 USD');

    const addressEl = fixture.debugElement.query(By.css('.tsc__address'));
    expect(addressEl.nativeElement.innerHTML).toContain('asdlkfjasd56lfjasdpodlfkj');
  });
});
