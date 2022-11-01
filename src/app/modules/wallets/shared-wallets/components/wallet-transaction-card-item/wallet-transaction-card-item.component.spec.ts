import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { WalletTransactionCardItemComponent } from './wallet-transaction-card-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NativeTransfer } from '../../models/transfer/native-transfer/native-transfer';
import { rawTransfer } from '../../fixtures/covalent-transfers.fixture';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { By } from '@angular/platform-browser';
import { EnvService } from '../../../../../shared/services/env/env.service';

describe('WalletTransactionCardItemComponent', () => {
  let component: WalletTransactionCardItemComponent;
  let fixture: ComponentFixture<WalletTransactionCardItemComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let envServiceSpy: jasmine.SpyObj<EnvService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    envServiceSpy = jasmine.createSpyObj('EnvService', {
      byKey: '0x72fdeb93a64a0eb2b789a9ed87e65bff967928c3',
    });

    TestBed.configureTestingModule({
      declarations: [WalletTransactionCardItemComponent, FormattedAmountPipe],
      imports: [IonicModule, TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: EnvService, useValue: envServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletTransactionCardItemComponent);
    component = fixture.componentInstance;
    component.transfer = new NativeTransfer(rawTransfer, rawMATICData, '0x1111111254fb6c44bac0bed2854e76f90643097d');
    component.network = 'MATIC';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set buy text and icon when transaction have directa24 address', () => {
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

    expect(component.formattedDate).toBe('19-08-2022');
  });

  it('should open browser on transaction link', () => {
    const divEl = fixture.debugElement.query(By.css('div.wtci'));
    divEl.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/transaction-details']);
  });
});
