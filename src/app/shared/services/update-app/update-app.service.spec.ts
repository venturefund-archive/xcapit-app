import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { alertControllerMock } from '../../../../testing/spies/alert-controller-mock.spec';
import { UpdateAppService } from './update-app.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { AppUpdateAvailability } from '@robingenz/capacitor-app-update';
import { RemoteConfigService } from '../remote-config/remote-config.service';

describe('UpdateAppService', () => {
  let service: UpdateAppService;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let appUpdateSpy: jasmine.SpyObj<any>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(() => {
    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getFeatureFlag: true,
    });
    appUpdateSpy = jasmine.createSpyObj('AppUpdate', {
      openAppStore: Promise.resolve(),
      getAppUpdateInfo: Promise.resolve({
        updateAvailability: AppUpdateAvailability.UPDATE_AVAILABLE
      })
    })
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
      ],
    });
    service = TestBed.inject(UpdateAppService);
    service.appUpdate = appUpdateSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show modal if update available', async () => {
    await service.checkForUpdate();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not show modal if up to date', async () => {
    const availability = {
      updateAvailability: AppUpdateAvailability.UPDATE_NOT_AVAILABLE
    };
    appUpdateSpy.getAppUpdateInfo.and.returnValue(availability);
    await service.checkForUpdate();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should not show modal if disabled in remote config', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    await service.checkForUpdate();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should call openAppStore on update', async () => {
    await service.update();
    expect(appUpdateSpy.openAppStore).toHaveBeenCalledTimes(1);
  });
});
