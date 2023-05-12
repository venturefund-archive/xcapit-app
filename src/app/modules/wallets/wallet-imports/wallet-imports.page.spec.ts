import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { WalletImportsPage } from './wallet-imports.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GoogleAuthService } from 'src/app/shared/services/google-auth/google-auth.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletInitializeProcess } from '../shared-wallets/services/wallet-initialize-process/wallet-initialize-process';
import { GoogleDriveFilesInjectable } from 'src/app/shared/models/google-drive-files/injectable/google-drive-files.injectable';
import { FakeGoogleDriveFiles } from 'src/app/shared/models/google-drive-files/fake/fake-google-drive-files';
import { rawGoogleDriveFile } from 'src/app/shared/fixtures/google-drive-files.raw';
import { GoogleDriveFile } from 'src/app/shared/models/google-drive-file/google-drive-file';
import { StorageWallet } from '../shared-wallets/interfaces/storage-wallet.interface';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { By } from '@angular/platform-browser';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletStorageDataFactoryInjectable } from '../shared-wallets/models/wallet-storage-data/injectable/wallet-storage-data-factory.injectable';
import { FakeWalletStorageData } from '../shared-wallets/models/wallet-storage-data/fake/fake-wallet-storage-data';
import { WalletStorageDataFactory } from '../shared-wallets/models/wallet-storage-data/factory/wallet-storage-data-factory';

describe('WalletImportsPage', () => {
  let component: WalletImportsPage;
  let fixture: ComponentFixture<WalletImportsPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let googleAuthServiceSpy: jasmine.SpyObj<GoogleAuthService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let walletInitializeProcessSpy: jasmine.SpyObj<WalletInitializeProcess>;
  let googleDriveFilesSpy: jasmine.SpyObj<GoogleDriveFilesInjectable>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let walletStorageDataFactoryInjectableSpy: jasmine.SpyObj<WalletStorageDataFactoryInjectable>;
  let walletStorageDataFactorySpy: jasmine.SpyObj<WalletStorageDataFactory>;

  const itemMethod = [
    {
      img: '/assets/img/wallets/key.svg',
      title: 'wallets.wallet_imports.key.title',
      subtitle: 'wallets.wallet_imports.key.subtitle',
      route: '/wallets/create-first/disclaimer/import',
    },
    {
      img: '/assets/img/wallets/cloud.svg',
      mode: 'external',
      title: 'wallets.wallet_imports.cloud.title',
      subtitle: 'wallets.wallet_imports.cloud.subtitle',
      route: 'googleAuth',
      name: 'ux_import_import_g-drive',
    },
  ];

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    googleAuthServiceSpy = jasmine.createSpyObj('GoogleAuthService', {
      accessToken: of('token'),
      createFile: of({}),
    });

    fakeModalController = new FakeModalController(null, { data: 'password' });
    modalControllerSpy = fakeModalController.createSpy();

    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showInfoToast: Promise.resolve(),
      showErrorToast: Promise.resolve(),
    });

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      saveWalletToStorage: Promise.resolve(),
      removeWalletFromStorage: Promise.resolve(),
    });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(null),
    });

    walletInitializeProcessSpy = jasmine.createSpyObj('WalletInitializeProcess', {
      run: Promise.resolve(),
    });

    googleDriveFilesSpy = jasmine.createSpyObj('InjectableGoogleDriveFiles', {
      create: new FakeGoogleDriveFiles(),
    });

    walletStorageDataFactorySpy = jasmine.createSpyObj('WalletStorageDataFactory',{
      oneBy: new FakeWalletStorageData(),
    })

    walletStorageDataFactoryInjectableSpy = jasmine.createSpyObj('WalletStorageDataFactoryInjectable', {
      create: walletStorageDataFactorySpy,
    });

    TestBed.configureTestingModule({
      declarations: [WalletImportsPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: GoogleAuthService, useValue: googleAuthServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: WalletInitializeProcess, useValue: walletInitializeProcessSpy },
        { provide: GoogleDriveFilesInjectable, useValue: googleDriveFilesSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: WalletStorageDataFactoryInjectable, useValue: walletStorageDataFactoryInjectableSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletImportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    const title = fixture.debugElement.query(By.css('div.wi__title > ion-text'));
    const subtitle = fixture.debugElement.query(By.css('div.wi__subtitle > ion-text'));
    const [cardEl1, cardEl2] = fixture.debugElement.queryAll(By.css('div.wi__method > app-import-method-options'));

    const support = fixture.debugElement.query(By.css('div.wi__support > ion-text'));

    expect(title.nativeElement.innerHTML).toContain('wallets.wallet_imports.title');
    expect(subtitle.nativeElement.innerHTML).toContain('wallets.wallet_imports.subtitle');

    expect(support.nativeElement.innerHTML).toContain('wallets.wallet_imports.support');
    expect(cardEl1).toBeTruthy();
    expect(cardEl2).toBeTruthy();
  });

  it('should navigate to when event is emited', () => {
    fixture.debugElement.query(By.css('app-import-method-options')).triggerEventHandler('route', itemMethod[0].route);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(itemMethod[0].route);
  });

  it('should navigate to faqs when support link is clicked', () => {
    fixture.debugElement.query(By.css('div.wi__support > ion-text')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/support/faqs/wallet');
  });

  it('should import, initialize wallet and redirect to success if there is a google drive backup ', fakeAsync(() => {
    googleDriveFilesSpy.create.and.returnValue(
      new FakeGoogleDriveFiles(Promise.resolve([new GoogleDriveFile(rawGoogleDriveFile)]), Promise.resolve('{}'))
    );

    fixture.debugElement.query(By.css('app-import-method-options')).triggerEventHandler('route', itemMethod[1].route);
    tick();

    expect(googleAuthServiceSpy.accessToken).toHaveBeenCalledTimes(1);
    expect(storageServiceSpy.saveWalletToStorage).toHaveBeenCalledOnceWith({} as StorageWallet);
    expect(walletInitializeProcessSpy.run).toHaveBeenCalledOnceWith(new Password('password'), true, new FakeWalletStorageData())
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('wallet_backup', true);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('/wallets/recovery/success');
  }));

  it('should show toast if there is not a google drive backup', async () => {
    fixture.debugElement.query(By.css('app-import-method-options')).triggerEventHandler('route', itemMethod[1].route);
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(googleAuthServiceSpy.accessToken).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledTimes(1);
  });

  it('should show closed error toast if google drive backup window was closed', async () => {
    googleAuthServiceSpy.accessToken.and.rejectWith({ error: 'popup_closed_by_user' });
    fixture.debugElement.query(By.css('app-import-method-options')).triggerEventHandler('route', itemMethod[1].route);
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
      message: 'wallets.wallet_imports.toasts.closed',
    });
  });

  it('should show denied error toast if access was denied', async () => {
    googleAuthServiceSpy.accessToken.and.rejectWith({ error: 'access_denied' });
    fixture.debugElement.query(By.css('app-import-method-options')).triggerEventHandler('route', itemMethod[1].route);
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
      message: 'wallets.wallet_imports.toasts.denied',
    });
  });

  it('should show denied error toast if permission was denied', fakeAsync(() => {
    googleDriveFilesSpy.create.and.returnValue(
      new FakeGoogleDriveFiles(Promise.reject({ error: { error: { status: 'PERMISSION_DENIED' } } }))
    );
    fixture.debugElement.query(By.css('app-import-method-options')).triggerEventHandler('route', itemMethod[1].route);
    tick();
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
      message: 'wallets.wallet_imports.toasts.denied',
    });
  }));

  it('should show password error toast if is incorrect', fakeAsync(() => {
    googleDriveFilesSpy.create.and.returnValue(
      new FakeGoogleDriveFiles(Promise.resolve([new GoogleDriveFile(rawGoogleDriveFile)]), Promise.resolve('{}'))
    );
    walletInitializeProcessSpy.run.and.rejectWith(new Error('invalid password'));
    fixture.debugElement.query(By.css('app-import-method-options')).triggerEventHandler('route', itemMethod[1].route);
    tick();
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
      message: 'wallets.wallet_imports.toasts.password',
    });
  }));
});
