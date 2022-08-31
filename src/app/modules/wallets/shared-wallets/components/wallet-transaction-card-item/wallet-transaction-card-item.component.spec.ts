import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { WalletTransactionCardItemComponent } from './wallet-transaction-card-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { NONPROD_SCAN_URLS } from '../../constants/scan-url-nonprod';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NativeTransfer } from '../../models/transfer/native-transfer/native-transfer';
import { rawTransfer } from '../../fixtures/covalent-transfers.fixture';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';

fdescribe('WalletTransactionCardItemComponent', () => {
  let component: WalletTransactionCardItemComponent;
  let fixture: ComponentFixture<WalletTransactionCardItemComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      
      TestBed.configureTestingModule({
        declarations: [WalletTransactionCardItemComponent, FormattedAmountPipe],
        imports: [IonicModule, TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }]
      }).compileComponents();

      fixture = TestBed.createComponent(WalletTransactionCardItemComponent);
      component = fixture.componentInstance;
      component.transfer= new NativeTransfer(rawTransfer,rawMATICData,'');
      component.network = 'MATIC';
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
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
