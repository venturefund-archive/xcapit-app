import { QueueService } from './../../../../shared/services/queue/queue.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { RemoveWalletPage } from './remove-wallet.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletConnectService } from '../../shared-wallets/services/wallet-connect/wallet-connect.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TxInProgressService } from 'src/app/modules/swaps/shared-swaps/services/tx-in-progress/tx-in-progress.service';

describe('RemoveWalletPage', () => {
  let component: RemoveWalletPage;
  let fixture: ComponentFixture<RemoveWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RemoveWalletPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let queueServiceSpy: jasmine.SpyObj<QueueService>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let txInProgressServiceSpy: jasmine.SpyObj<TxInProgressService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      removeWalletFromStorage: Promise.resolve(),
    });

    queueServiceSpy = jasmine.createSpyObj('QueueService', {
      dequeueAll: Promise.resolve(),
    });

    walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', {
      killSession: Promise.resolve(),
    });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
      remove: Promise.resolve(),
      clear: Promise.resolve(),
    });

    txInProgressServiceSpy = jasmine.createSpyObj('TxInProgressService', {
      clean: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [RemoveWalletPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: QueueService, useValue: queueServiceSpy },
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: TxInProgressService, useValue: txInProgressServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should activated button when checkbox is checked', async () => {
    fixture.debugElement
      .query(By.css("ion-checkbox[name='checkbox-condition']"))
      .triggerEventHandler('ionChange', { target: {} });
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const buttonEl = fixture.debugElement.query(By.css("ion-button[name='remove_wallet']"));
    expect(buttonEl.attributes['ng-reflect-disabled']).toBe('false');
  });

  it('should disabled button when checkbox is not checked', () => {
    const buttonEl = fixture.debugElement.query(By.css("ion-button[name='remove_wallet']"));
    expect(buttonEl.attributes['ng-reflect-disabled']).toBe('true');
  });

  it('should remove wallet and navigate to success page when checkbox is checked and button remove_wallet is clicked', async () => {
    fixture.debugElement.query(By.css("ion-checkbox[name='checkbox-condition']")).nativeElement.click();
    fixture.debugElement.query(By.css("ion-button[name='remove_wallet']")).nativeElement.click();
    await fixture.whenStable();
    expect(storageServiceSpy.removeWalletFromStorage).toHaveBeenCalledTimes(1);
    expect(queueServiceSpy.dequeueAll).toHaveBeenCalledTimes(1);
    expect(walletConnectServiceSpy.killSession).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/remove/success']);
    expect(txInProgressServiceSpy.clean).toHaveBeenCalledTimes(1);
  });
});
