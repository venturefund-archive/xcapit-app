import { TestBed } from '@angular/core/testing';
import { ModalFactoryInjectable } from './modal-factory.injectable';
import { DefaultModalFactory } from '../factory/default/default-modal-factory';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { ModalController } from '@ionic/angular';

describe('ModalFactoryInjectable', () => {
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let service: ModalFactoryInjectable;

  beforeEach(() => {
    fakeModalController = new FakeModalController(null, {});
    modalControllerSpy = fakeModalController.createSpy();

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
    }).compileComponents();

    service = TestBed.inject(ModalFactoryInjectable);
  });

  it('create', () => {
    expect(service.create(null, null)).toBeInstanceOf(DefaultModalFactory);
  });
});
