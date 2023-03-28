import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { rawUSDCData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { ApiTicketsService } from '../../tickets/shared-tickets/services/api-tickets.service';
import { SummaryWarrantyData } from '../send-warranty/interfaces/summary-warranty-data.interface';
import { WarrantyDataService } from '../shared-warranties/services/send-warranty-data/send-warranty-data.service';
import { WithdrawWarrantySummaryPage } from './withdraw-warranty-summary.page';

describe('WithdrawWarrantySummaryPage', () => {
  let component: WithdrawWarrantySummaryPage;
  let fixture: ComponentFixture<WithdrawWarrantySummaryPage>;
  let warrantyDataServiceSpy: jasmine.SpyObj<WarrantyDataService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let apiTicketServiceSpy: jasmine.SpyObj<ApiTicketsService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  const summaryData: SummaryWarrantyData = {
    amount: 10,
    coin: rawUSDCData,
    user_dni: 1234567,
    quoteAmount: 10,
    quoteAmountWithoutCost: 9.8,
    service_cost: 0.2,
    amountWithoutCost: 9.8,
    email: 'test@test.com',
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
    TestBed.configureTestingModule({
      declarations: [WithdrawWarrantySummaryPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: WarrantyDataService, useValue: warrantyDataServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ApiTicketsService, useValue: apiTicketServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
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

  it('should get data of service on init', () => {
    component.ionViewWillEnter();
    expect(component.warrantyData).toEqual(summaryData);
  });

  it('should send ticket to hubspot with correct data and show success modal when button ux_warranty_withdraw_confirm is clicked and password is correct', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(apiTicketServiceSpy.createTicket).toHaveBeenCalledWith(correctDataTicket);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
  });

  it('should not send ticket to hubspot when button ux_warranty_withdraw_confirm is clicked and password is invalid', async () => {
    fakeModalController.modifyReturns(null, Promise.resolve({ data: undefined }));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(apiTicketServiceSpy.createTicket).toHaveBeenCalledTimes(0);
  });

  it('should show error modal when button ux_warranty_withdraw_confirm is clicked and data ticket is incorrect', async () => {
    apiTicketServiceSpy.createTicket.and.returnValue(throwError('Error'));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(apiTicketServiceSpy.createTicket).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
