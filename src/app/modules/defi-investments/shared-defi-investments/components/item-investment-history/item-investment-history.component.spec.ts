import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { ItemInvestmentHistoryComponent } from './item-investment-history.component';

describe('ItemInvestmentHistoryComponent', () => {
  let component: ItemInvestmentHistoryComponent;
  let fixture: ComponentFixture<ItemInvestmentHistoryComponent>;
  let movementSpy: jasmine.SpyObj<any>;
  let tokenSpy: jasmine.SpyObj<Coin>;

  beforeEach(waitForAsync(() => {
    movementSpy = jasmine.createSpyObj(
      'movement',
      {},
      {
        amount: '5000000',
        timestamp: '1661194501',
        type: 'withdraw',
      }
    );

    tokenSpy = jasmine.createSpyObj(
      'token',
      {},
      {
        decimals: 6,
        value: 'USDC',
      }
    );
    TestBed.configureTestingModule({
      declarations: [ItemInvestmentHistoryComponent, FormattedAmountPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemInvestmentHistoryComponent);
    component = fixture.componentInstance;
    component.movement = movementSpy;
    component.token = tokenSpy;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const iconEl = fixture.debugElement.query(By.css('ion-icon[name="ux-withdraw"'));
    const typeEl = fixture.debugElement.query(By.css('ion-text.iih__content__type-date__type'));
    const dateEl = fixture.debugElement.query(By.css('ion-text.iih__content__type-date__date'));
    const amountEl = fixture.debugElement.query(By.css('ion-text.iih__content__amount__amount'));
    expect(iconEl).toBeTruthy();
    expect(typeEl.nativeElement.innerHTML).toContain('defi_investments.invest_detail.history.withdraw');
    expect(dateEl.nativeElement.innerHTML).toContain('22-8-2022');
    expect(amountEl.nativeElement.innerHTML).toContain('5');
  });
});
