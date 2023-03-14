import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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
    dni: 1234567,
    quoteAmount: 10,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WarrantySummaryCardComponent, FormattedAmountPipe, FormattedNetworkPipe],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WarrantySummaryCardComponent);
    component = fixture.componentInstance;
    component.warrantyData = summaryData;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
