import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { UpdateAppModalComponent } from '../../components/update-app-modal/update-app-modal.component';
import { RemoteConfigService } from '../remote-config/remote-config.service';
import { UpdateService } from './update.service';
@Injectable({
  providedIn: 'root',
})
class UpdateMockService extends UpdateService {
  constructor (
    modalController: ModalController,
    remoteConfigService: RemoteConfigService,
  ) {
    super(modalController, remoteConfigService);
  }

  public update(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public handleCheckForUpdate(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
describe('UpdateService', () => {
  let service: UpdateMockService;
  let modalFixture: ComponentFixture<UpdateAppModalComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(() => {
    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getFeatureFlag: true
    });
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [UpdateAppModalComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
      ],
    });
    modalFixture = TestBed.createComponent(UpdateAppModalComponent);
    modalFixture.detectChanges();
    service = TestBed.inject(UpdateMockService);
  });

  it('should check for update if feature enabled on remote config', async () => {
    const spy = spyOn(service, 'handleCheckForUpdate');
    await service.checkForUpdate();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not check for update if feature disabled on remote config', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    const spy = spyOn(service, 'handleCheckForUpdate');
    await service.checkForUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should update app if user clicked Update button on modal', async () => {
    const spy = spyOn(service, 'update');
    fakeModalController.modifyReturns({data:true}, {});
    await service.showRecommendedModal();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not update app if user clicked Close button on modal', async () => {
    const spy = spyOn(service, 'update');
    fakeModalController.modifyReturns({data:false}, {});
    await service.showRecommendedModal();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
