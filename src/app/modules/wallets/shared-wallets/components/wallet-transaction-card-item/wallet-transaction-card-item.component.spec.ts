import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { WalletTransactionCardItemComponent } from './wallet-transaction-card-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { NONPROD_SCAN_URLS } from '../../constants/scan-url-nonprod';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { By } from '@angular/platform-browser';

const transaction = {
  icon: 'assets/img/wallet-transactions/received.svg',
  type: 'IN',
  asset: 'ETH',
  from: '0x00000000000000000000000000',
  to: '0x00000000000000000000000001',
  value: '0.2',
  hash: '0x000000000000000000000000000000000000000000001',
  date: '2020-01-03T03:00:00Z',
  blockNumber: '0x00000001',
  erc721: false,
  rawContract: false,
  swap: {
    currencyIn: '',
    currencyOut: '',
    amountIn: null,
    amountOut: null,
  },
};

describe('WalletTransactionCardItemComponent', () => {
  let component: WalletTransactionCardItemComponent;
  let fixture: ComponentFixture<WalletTransactionCardItemComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let envServiceSpy: jasmine.SpyObj<EnvService>;
  beforeEach(
    waitForAsync(() => {
      browserServiceSpy = jasmine.createSpyObj('BrowserService', {open:Promise.resolve()})
      
    envServiceSpy = jasmine.createSpyObj('EnvService', {
      byKey: '0xtestd24address',
    });
      TestBed.configureTestingModule({
        declarations: [WalletTransactionCardItemComponent, FormattedAmountPipe],
        imports: [IonicModule, TranslateModule.forRoot()],
        providers: [{ provide: EnvService, useValue: envServiceSpy },{provide:BrowserService, useValue:browserServiceSpy}]
      }).compileComponents();

      fixture = TestBed.createComponent(WalletTransactionCardItemComponent);
      component = fixture.componentInstance;
      component.transaction = transaction;
      component.network = 'MATIC';
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set buy text and icon when transaction have directa24 address', () => {
    component.transaction.from = '0xtestd24address';
    component.ngOnInit();
    fixture.detectChanges();
    const typeEl = fixture.debugElement.query(By.css('div.wtci__content__top__type_date_hash__type_date  .type'));
    const iconEl = fixture.debugElement.query(By.css('.wtci__img'));
    expect(typeEl.nativeElement.innerHTML).toContain('wallets.transactions.BUY');
    expect(iconEl.nativeElement.src).toContain('assets/img/wallet-transactions/buy.svg');
  });


  it('should format date on init', async () => {
    component.ngOnInit();

    await fixture.whenRenderingDone();

    expect(component.formattedDate).toBe('03-01-2020');
  });

  it ('should open browser on transaction link', () => {
    const expectedUrl = `${NONPROD_SCAN_URLS[component.network]}tx/${transaction.hash}`;

    component.openTransactionUrl();

    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: expectedUrl })
  })
});
