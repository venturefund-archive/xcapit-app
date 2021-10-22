import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SupportBinanceInvestmentsPage } from './support-binance-investments.page';

describe('SupportBinanceInvestmentsPage', () => {
  let component: SupportBinanceInvestmentsPage;
  let fixture: ComponentFixture<SupportBinanceInvestmentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupportBinanceInvestmentsPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportBinanceInvestmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
