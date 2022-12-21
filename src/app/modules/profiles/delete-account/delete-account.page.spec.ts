import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ApiTicketsService } from '../../tickets/shared-tickets/services/api-tickets.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletConnectService } from '../../wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { DeleteAccountDataService } from '../shared-profiles/services/delete-account-data/delete-account-data.service';
import { DeleteAccountPage } from './delete-account.page';

describe('DeleteAccountPage', () => {
  let component: DeleteAccountPage;
  let fixture: ComponentFixture<DeleteAccountPage>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let apiTicketServiceSpy: jasmine.SpyObj<ApiTicketsService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let deleteAccountDataServiceSpy: jasmine.SpyObj<DeleteAccountDataService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(waitForAsync(() => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletFromStorage: Promise.resolve({
        addresses: { ERC20: 'testAddressERC20' },
      }),
      removeWalletFromStorage: Promise.resolve(),
    });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      clear: Promise.resolve(),
    });

    walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', {
      killSession: Promise.resolve(),
    });

    apiTicketServiceSpy = jasmine.createSpyObj('ApiTicketService', {
      createTicket: of({}),
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    deleteAccountDataServiceSpy = jasmine.createSpyObj(
      'DeleteAccountDataService',
      {},
      {
        email: 'test@test.com',
      }
    );

    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showErrorToast: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [DeleteAccountPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
        { provide: ApiTicketsService, useValue: apiTicketServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: DeleteAccountDataService, useValue: deleteAccountDataServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user wallet address on init', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(storageServiceSpy.getWalletFromStorage).toHaveBeenCalledTimes(1);
    expect(component.wallet).toEqual('testAddressERC20');
  });

  it('should save data, clear storage and go to success page when delete account button is clicked and the create ticket is successfull', async () => {
    component.form.patchValue({ email: 'test@test.com' });
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_confirm_delete_account"]')).nativeElement.click();
    expect(deleteAccountDataServiceSpy.email).toEqual('test@test.com');
    expect(apiTicketServiceSpy.createTicket).toHaveBeenCalledWith({
      email: 'test@test.com',
      category_code: 'Mi cuenta/Registro',
      subject: 'tickets.categories.my_account',
      message: 'profiles.user_profile_menu.delete_account_message',
    });
    expect(storageServiceSpy.removeWalletFromStorage).toHaveBeenCalledTimes(1);
    expect(ionicStorageServiceSpy.clear).toHaveBeenCalledTimes(1);
    expect(walletConnectServiceSpy.killSession).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith('profiles/success-delete-account');
  });

  it('should show error toast when delete account button is clicked and the create ticket fails', async () => {
    apiTicketServiceSpy.createTicket.and.returnValue(throwError('Error'));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_confirm_delete_account"]')).nativeElement.click();
    expect(storageServiceSpy.removeWalletFromStorage).toHaveBeenCalledTimes(0);
    expect(ionicStorageServiceSpy.clear).toHaveBeenCalledTimes(0);
    expect(walletConnectServiceSpy.killSession).toHaveBeenCalledTimes(0);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
  });

  it('should navigate to support wallet page when link is clicked', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-text.da__disclaimer__link')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('support/faqs/wallet');
  });
});
