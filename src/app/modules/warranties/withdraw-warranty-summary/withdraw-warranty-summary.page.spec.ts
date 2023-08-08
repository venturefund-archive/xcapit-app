import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { rawTokensData, rawUSDCData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { ApiTicketsService } from '../../tickets/shared-tickets/services/api-tickets.service';
import { SummaryWarrantyData } from '../send-warranty/interfaces/summary-warranty-data.interface';
import { WarrantyDataService } from '../shared-warranties/services/send-warranty-data/send-warranty-data.service';
import { WarrantiesService } from '../shared-warranties/services/warranties.service';
import { WithdrawWarrantySummaryPage } from './withdraw-warranty-summary.page';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ActiveLenderInjectable } from 'src/app/shared/models/active-lender/injectable/active-lender.injectable';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { FakeLender } from 'src/app/shared/models/lender/fake/fake-lender';

describe('WithdrawWarrantySummaryPage', () => {
  let component: WithdrawWarrantySummaryPage;
  let fixture: ComponentFixture<WithdrawWarrantySummaryPage>;
  let warrantyDataServiceSpy: jasmine.SpyObj<WarrantyDataService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let apiTicketServiceSpy: jasmine.SpyObj<ApiTicketsService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let warrantyServiceSpy: jasmine.SpyObj<WarrantiesService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let activeLenderInjectableSpy: jasmine.SpyObj<ActiveLenderInjectable>;
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  const summaryData: SummaryWarrantyData = {
    amount: 10,
    user_dni: 1234567,
    quoteAmount: 10,
    service_cost: 0.2,
    email: 'test@test.com',
    wallet: '0x1',
    lender: 'aLenderName',
  };

  const correctDataTicket = {
    email: 'test@test.com',
    category_code: 'Garantía',
    subject: 'tickets.categories.warranty',
    message: 'warranties.withdraw_warranty_summary.ticket_message',
  };

  beforeEach(waitForAsync(() => {
    warrantyDataServiceSpy = jasmine.createSpyObj('WarrantyDataService', {}, { data: summaryData });
    fakeModalController = new FakeModalController(null, { data: 'testPassword' });
    modalControllerSpy = fakeModalController.createSpy();
    apiTicketServiceSpy = jasmine.createSpyObj('ApiTicketService', {
      createTicket: of({}),
    });
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    warrantyServiceSpy = jasmine.createSpyObj('WarrantyService', { withdrawWarranty: of({ summaryData }) });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
    });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: rawTokensData,
      getCoin: rawUSDCData,
    });

    activeLenderInjectableSpy = jasmine.createSpyObj('ActiveLenderInjectable', {
      create: { value: () => Promise.resolve(new FakeLender()) },
    });

    TestBed.configureTestingModule({
      declarations: [WithdrawWarrantySummaryPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: WarrantyDataService, useValue: warrantyDataServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ApiTicketsService, useValue: apiTicketServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: WarrantiesService, useValue: warrantyServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: ActiveLenderInjectable, useValue: activeLenderInjectableSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WithdrawWarrantySummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data of service on init', async () => {
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(component.warrantyData).toEqual(summaryData);
  });

  it('should send ticket to hubspot with correct data and show success modal when button ux_warranty_withdraw_confirm is clicked and password is correct', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(apiTicketServiceSpy.createTicket).toHaveBeenCalledWith(correctDataTicket);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
  });

  it('should not send ticket to hubspot when button ux_warranty_withdraw_confirm is clicked and password is invalid', async () => {
    fakeModalController.modifyReturns(null, Promise.resolve({ data: undefined }));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(apiTicketServiceSpy.createTicket).toHaveBeenCalledTimes(0);
  });

  it('should show error modal when button ux_warranty_withdraw_confirm is clicked and data ticket is incorrect', async () => {
    apiTicketServiceSpy.createTicket.and.returnValue(throwError('Error'));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(apiTicketServiceSpy.createTicket).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
  });

  it('should track screenview event on init', async () => {
    await component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should save user dni in storage when ux_warranty_withdraw_confirm is clicked and dni is valid', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();

    expect(ionicStorageServiceSpy.set).toHaveBeenCalledOnceWith('user_dni', 1234567);
  });
});
