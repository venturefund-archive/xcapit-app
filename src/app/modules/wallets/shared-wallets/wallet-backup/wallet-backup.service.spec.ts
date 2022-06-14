import { fakeAsync,TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FakeModalController } from '../../../../../testing/fakes/modal-controller.fake.spec';
import { WalletBackupService } from './wallet-backup.service';
import { ModalController, NavController } from '@ionic/angular';
import { WarningBackupModalComponent } from '../../shared-wallets/components/warning-backup-modal/warning-backup-modal.component';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

const modalOptions = {
  component: WarningBackupModalComponent,
  componentProps: {},
  cssClass: 'ux-md-modal-informative',
  backdropDismiss: false,
};1

fdescribe('WalletBackupService', () => {
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
        get: Promise.resolve(true),
        set: Promise.resolve(),
      });

      TestBed.configureTestingModule({
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
    await service.presentModal();
    expect(modalControllerSpy.create).toHaveBeenCalledOnceWith(modalOptions);
  });

  it('should open modal and return skip when user clicks skip', async () => {
    fakeModalController.modifyReturns({ data: 'skip' }, null);
    const answer = await service.presentModal();
    expect(modalControllerSpy.create).toHaveBeenCalledOnceWith(modalOptions);
    expect(answer).toEqual('skip');
  });

  it('should open modal and and do nothing when user clicks close', async () => {
    fakeModalController.modifyReturns({ data: 'close' }, null);
    const answer = await service.presentModal();
    expect(modalControllerSpy.create).toHaveBeenCalledOnceWith(modalOptions);
    expect(answer).toEqual('close');
  });

  it('should open modal and navigate to backup wallet when user clicks backup', async () => {
    fakeModalController.modifyReturns({ data: 'backup' }, null);
    const answer = await service.presentModal();
    expect(modalControllerSpy.create).toHaveBeenCalledOnceWith(modalOptions);
    expect(answer).toEqual('backup');
  });

  it('should not open modal when modal is disabled on feature flag', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    fakeModalController.modifyReturns({ data: 'skip' }, null);
    await service.presentModal();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should not open modal again until user opens a new session', async () => {
    fakeModalController.modifyReturns({ data: 'skip' }, null);
    await service.presentModal();
    await service.presentModal();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not open modal twice when user spams click', fakeAsync(() => {
    fakeModalController.modifyReturns({ data: 'skip' }, null);
    service.presentModal();
    service.presentModal();
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  }));

  it('should enable modal on enableModal', async () => {
    await service.enableModal();
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledOnceWith('backupWarningWallet', true);
  });

  it('should disable modal on disableModal', async () => {
    await service.disableModal();
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledOnceWith('backupWarningWallet', false);
  });
});
