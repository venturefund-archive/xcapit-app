import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TransactionDetailsPage } from './transaction-details.page';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionDetailsService } from '../shared-wallets/services/transaction-details/transaction-details.service';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ScanUrlOf } from '../shared-wallets/models/scan-url-of/scan-url-of';
import { rawTransfer } from '../shared-wallets/fixtures/covalent-transfers.fixture';
import { NativeTransfer } from '../shared-wallets/models/transfer/native-transfer/native-transfer';
import { rawMATICData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { FormattedNetworkPipe } from '../../../shared/pipes/formatted-network-name/formatted-network.pipe';
import { FormattedAmountPipe } from '../../../shared/pipes/formatted-amount/formatted-amount.pipe';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

describe('TransactionDetailsPage', () => {
  let component: TransactionDetailsPage;
  let fixture: ComponentFixture<TransactionDetailsPage>;
  let transactionDetailsServiceSpy: jasmine.SpyObj<TransactionDetailsService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(waitForAsync(() => {
    transactionDetailsServiceSpy = jasmine.createSpyObj(
      'TransactionDetailsService',
      {},
      {
        transactionData: new NativeTransfer(rawTransfer, rawMATICData, ''),
      }
    );

    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    TestBed.configureTestingModule({
      declarations: [TransactionDetailsPage, FormattedNetworkPipe, FormattedAmountPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: TransactionDetailsService, useValue: transactionDetailsServiceSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open scan when link is clicked', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-text[name="scan_link"]')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({
      url: ScanUrlOf.create(component.tplTransfer.tx_hash, component.tplTransfer.token.network).value(),
    });
  });

  it('should open modal when information-circle button is clicked', async () => {
    component.ionViewWillEnter()
    fixture.detectChanges()
    fixture.debugElement.query(By.css('ion-icon[name="information-circle"]')).nativeElement.click()
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should navigate to write support ticket when support link is clicked', () => {
    fixture.debugElement.query(By.css('ion-text[name="support_link"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/create-support-ticket']);
  })
});
