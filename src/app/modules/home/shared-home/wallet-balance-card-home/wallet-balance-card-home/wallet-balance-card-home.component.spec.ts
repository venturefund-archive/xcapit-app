import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletBalanceCardHomeComponent } from './wallet-balance-card-home.component';

describe('WalletBalanceCardHomeComponent', () => {
  let component: WalletBalanceCardHomeComponent;
  let fixture: ComponentFixture<WalletBalanceCardHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletBalanceCardHomeComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletBalanceCardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
