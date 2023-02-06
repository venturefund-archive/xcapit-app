import { fakeAsync,TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FakeModalController } from '../../../../../../testing/fakes/modal-controller.fake.spec';
import { WalletBackupService } from './wallet-backup.service';
import { ModalController } from '@ionic/angular';
import { WarningBackupModalComponent } from '../../components/warning-backup-modal/warning-backup-modal.component';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';

const modalOptions = {
  component: WarningBackupModalComponent,
  componentProps: {},
  cssClass: 'modal',
  backdropDismiss: false,
};

describe('WalletBackupService', () => {
  let service: WalletBackupService;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
        getFeatureFlag: true
      });

      ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
        get: Promise.resolve(),
        set: Promise.resolve(),
      });
      ionicStorageServiceSpy.get.and.callFake( (key: string) => {
            let result = Promise.resolve(true);
            if (key === 'protectedWallet') {
              result = Promise.resolve(false);
            }
            if (key === 'backupWarningWallet') {
              result = Promise.resolve(true);
            }
            return result;
          }
        );
      TestBed.configureTestingModule({
        declarations: [FakeFeatureFlagDirective],
        providers: [
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
          { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        ],
      });
      service = TestBed.inject(WalletBackupService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should present backup modal on presentModal', async () => {
    await service.getBackupWarningWallet();
    await service.presentModal();

    expect(modalControllerSpy.create).toHaveBeenCalledOnceWith(modalOptions);
  });

  it('should open modal and return skip when user clicks skip', async () => {
    fakeModalController.modifyReturns({ data: 'skip' }, null);
    await service.getBackupWarningWallet();
    const answer = await service.presentModal();
    expect(modalControllerSpy.create).toHaveBeenCalledOnceWith(modalOptions);
    expect(answer).toEqual('skip');
  });

  it('should open modal and do nothing when user clicks close', async () => {
    fakeModalController.modifyReturns({ data: 'close' }, null);
    await service.getBackupWarningWallet();
    const answer = await service.presentModal();
    expect(modalControllerSpy.create).toHaveBeenCalledOnceWith(modalOptions);
    expect(answer).toEqual('close');
  });

  it('should open modal and navigate to backup wallet when user clicks backup', async () => {
    fakeModalController.modifyReturns({ data: 'backup' }, null);
    await service.getBackupWarningWallet();
    const answer = await service.presentModal();
    expect(modalControllerSpy.create).toHaveBeenCalledOnceWith(modalOptions);
    expect(answer).toEqual('backup');
  });

  it('should not open modal when modal is disabled on feature flag', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    fakeModalController.modifyReturns({ data: 'skip' }, null);
    await service.getBackupWarningWallet();
    await service.presentModal();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should not open modal again until user opens a new session', async () => {
    fakeModalController.modifyReturns({ data: 'skip' }, null);
    await service.getBackupWarningWallet();
    await service.presentModal();
    await service.presentModal();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not open modal twice when user spams click', fakeAsync(() => {
    fakeModalController.modifyReturns({ data: 'skip' }, null);
    service.getBackupWarningWallet();
    tick();
    service.presentModal();
    service.presentModal();
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  }));

  it('should enable modal on enableModal', async () => {
    await service.enableModal();
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('backupWarningWallet', true)
  });

  it('should disable modal on disableModal', async () => {
    await service.disableModal();
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('backupWarningWallet', false)
  });
});
