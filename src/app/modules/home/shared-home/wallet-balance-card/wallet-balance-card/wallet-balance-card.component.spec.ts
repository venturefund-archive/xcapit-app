import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletBalanceCardComponent } from './wallet-balance-card.component';

describe('WalletBalanceCardComponent', () => {
  let component: WalletBalanceCardComponent;
  let fixture: ComponentFixture<WalletBalanceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletBalanceCardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletBalanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
