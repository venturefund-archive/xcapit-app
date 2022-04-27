import { TestBed } from '@angular/core/testing';
import { UpdatePWAService } from './update-pwa.service';
import { TranslateModule } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { RemoteConfigService } from '../remote-config/remote-config.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
describe('UpdatePWAService', () => {
  let service: UpdatePWAService;
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
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
      ],
    });
    service = TestBed.inject(UpdatePWAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
