import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { rawUSDCData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { WalletTransactionsService } from '../../wallets/shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { SummaryWarrantyData } from '../send-warranty/interfaces/summary-warranty-data.interface';
import { WarrantyDataService } from '../shared-warranties/services/warranty-data.service';
import { WarrantySummaryPage } from './warranty-summary.page';

describe('WarrantySummaryPage', () => {
  let component: WarrantySummaryPage;
  let fixture: ComponentFixture<WarrantySummaryPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let warrantyDataServiceSpy: jasmine.SpyObj<WarrantyDataService>;
  const aPassword = new Password('aPassword');
  const summaryData: SummaryWarrantyData = {
    amount: 10,
    coin: rawUSDCData,
    dni: 1234567,
    quoteAmount: 10,
    quoteAmountWithoutCost: 9.8,
    serviceCost: 0.2,
    amountWithoutCost: 9.8,
  };
  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    fakeModalController = new FakeModalController(null, { data: aPassword });
    modalControllerSpy = fakeModalController.createSpy();

    walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionService', {
      send: Promise.resolve({ wait: () => Promise.resolve({ transactionHash: 'someHash' }) }),
      canAffordSendTx: Promise.resolve(true),
    });

    warrantyDataServiceSpy = jasmine.createSpyObj('WarrantyDataService', {}, { data: summaryData });
    TestBed.configureTestingModule({
      declarations: [WarrantySummaryPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
        { provide: WarrantyDataService, useValue: warrantyDataServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WarrantySummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data and calculate warranty amounts correctly on init', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.warrantyData).toEqual(summaryData);
  });

  it('should send and show succes modal when user can afford fees and password is correct on ux_warranty_start_confirm button clicked', async () => {
    fakeModalController.modifyReturns(null, Promise.resolve({ data: aPassword }));
    component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith(
      aPassword.value(),
      10,
      '0xdd3c288e12f2bc0207b15e609519832378f588d5',
      summaryData.coin
    );
  });

  it('should disabled loading when ux_warranty_start_confirm button is clicked and password undefined', async () => {
    fakeModalController.modifyReturns(null, { data: undefined });
    component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();

    expect(component.loading).toBeFalsy();
  });
});
