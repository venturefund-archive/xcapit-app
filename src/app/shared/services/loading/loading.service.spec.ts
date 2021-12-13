import { TestBed } from '@angular/core/testing';

import { LoadingModalOptions, LoadingService } from './loading.service';
import { TranslateModule } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';

const options: LoadingModalOptions = {
  title: 'test',
  subtitle: 'test_subtitle',
  image: 'test_image',
};
describe('LoadingService', () => {
  let service: LoadingService;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  beforeEach(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create modal when show modal is called', () => {
    service.showModal(options);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
