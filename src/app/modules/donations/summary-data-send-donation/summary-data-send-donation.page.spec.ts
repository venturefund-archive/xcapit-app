import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationExtras } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalNotificationSchema } from '@capacitor/local-notifications';
import { AlertController, IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BigNumber, constants } from 'ethers';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { LocalNotificationsService } from '../../notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { PasswordErrorMsgs } from '../../swaps/shared-swaps/models/password/password-error-msgs';
import { WalletTransactionsService } from '../../wallets/shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { SendDonationDataService } from '../shared-donations/services/send-donation-data.service';
import { SummaryDataSendDonationPage } from './summary-data-send-donation.page';

const testLocalNotification: LocalNotificationSchema = {
  id: 1,
  title: 'wallets.send.send_summary.sent_notification.title',
  body: 'wallets.send.send_summary.sent_notification.body',
};

describe('SummaryDataSendDonationPage', () => {
  let component: SummaryDataSendDonationPage;
  let fixture: ComponentFixture<SummaryDataSendDonationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SummaryDataSendDonationPage>;
  let sendDonationDataSpy: any;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let localNotificationsServiceSpy: jasmine.SpyObj<LocalNotificationsService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let alertSpy: jasmine.SpyObj<HTMLIonAlertElement>;
  let summaryDataSpy: jasmine.SpyObj<any>;

  beforeEach(
    waitForAsync(() => {
      summaryDataSpy = jasmine.createSpyObj(
        'summaryDataSpy',
        {},
        {
          network: 'ERC20',
          currency: {
            value: 'ETH',
          },
          address: constants.AddressZero,
          amount: 1,
          referenceAmount: '50000',
          balance: 2,
          cause:'pulenta'
        }
      );
      alertSpy = jasmine.createSpyObj('Alert', { present: Promise.resolve() });
      alertControllerSpy = jasmine.createSpyObj('AlertController', { create: Promise.resolve(alertSpy) });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      localNotificationsServiceSpy = jasmine.createSpyObj('LocalNotificationsService', {
        send: Promise.resolve(),
      });
      sendDonationDataSpy = { data: summaryDataSpy, cause: 'unhcr' };
      walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionService', {
        send: Promise.resolve({ wait: () => Promise.resolve({ transactionHash: 'someHash' }) }),
        canAffordSendFee: Promise.resolve(true),
        canAffordSendTx: Promise.resolve(true),
        estimateSendFee: Promise.resolve(BigNumber.from('1000')),
      });
      fakeModalController = new FakeModalController(null, { data: 'testPassword' });
      modalControllerSpy = fakeModalController.createSpy();
      loadingServiceSpy = jasmine.createSpyObj('LoadingService', {
        show: Promise.resolve(),
        dismiss: Promise.resolve(),
      });
      TestBed.configureTestingModule({
        declarations: [SummaryDataSendDonationPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
        providers: [
          { provide: SendDonationDataService, useValue: sendDonationDataSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
          { provide: LoadingService, useValue: loadingServiceSpy },
          { provide: LocalNotificationsService, useValue: localNotificationsServiceSpy },
          { provide: AlertController, useValue: alertControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(SummaryDataSendDonationPage);
      component = fixture.componentInstance;
      component.summaryData = summaryDataSpy;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when ux_donations_send Button clicked', () => {
    spyOn(component, 'handleSubmit');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_donations_send');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get data on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(component.summaryData).toEqual(summaryDataSpy);
  });

  it('should send and navigate to success when user can afford fees and password is correct ux_donations_send Button clicked', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick(3000);
    fixture.debugElement.query(By.css('ion-button[name="ux_donations_send"]')).nativeElement.click();
    tick(100000);
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith(
      'testPassword',
      1,
      constants.AddressZero,
      summaryDataSpy.currency
    );
    expect(component.isSending).toBeFalse();
    expect(localNotificationsServiceSpy.send).toHaveBeenCalledOnceWith([testLocalNotification]);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/donations/success']);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  }));

  it('should navigate to error page when modal is closed and password is incorrect', async () => {
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'invalid' }));
    walletTransactionsServiceSpy.send.and.rejectWith({ message: new PasswordErrorMsgs().invalid() });
    fixture.debugElement.query(By.css('ion-button[name="ux_donations_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith(
      'invalid',
      1,
      constants.AddressZero,
      summaryDataSpy.currency
    );
    expect(component.isSending).toBeFalse();
    expect(localNotificationsServiceSpy.send).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/donations/invalid-password');
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should cancel transaction if user closed modal', async () => {
    fakeModalController.modifyReturns(null, Promise.resolve({}));
    fixture.debugElement.query(By.css('ion-button[name="ux_donations_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(walletTransactionsServiceSpy.send).not.toHaveBeenCalled();
    expect(component.isSending).toBeFalse();
    expect(localNotificationsServiceSpy.send).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
  });

  it('should show loader at the start of transaction and dismiss it afterwards', fakeAsync(() => {
    component.handleSubmit();
    tick(50);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
  }));

  it('should redirect to error Page if not enough funds for transaction estimated cost', async () => {
    walletTransactionsServiceSpy.canAffordSendTx.and.resolveTo(false);
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_donations_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.isSending).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/donations/error']);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should redirect to error Page if not enough funds for transaction estimated cost', async () => {
    walletTransactionsServiceSpy.send.and.rejectWith(new Error('insufficient funds'));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_donations_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.isSending).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/donations/error']);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should redirect to error Page if address is invalid', async () => {
    summaryDataSpy = {
      address: 'invalid',
    };
    sendDonationDataSpy.data = summaryDataSpy;
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_donations_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.isSending).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/donations/error']);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should open alert and not send transaction nor redirect user if user cannot afford fees', async () => {
    walletTransactionsServiceSpy.canAffordSendFee.and.resolveTo(false);
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_donations_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(localNotificationsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(alertSpy.present).toHaveBeenCalledTimes(1);
  });

  it('should navigate back page when ux_donations_back is clicked', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_donations_back"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/donations/send-donation/cause/', 'pulenta', 'value', 'ETH', 'network', 'ERC20']);
  });
});
