import { TestBed } from '@angular/core/testing';
import BalanceModalInjectable from './balance-modal.injectable';
import BalanceModal from '../balance-modal';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from '../../../services/ionic-storage/ionic-storage.service';
import { ModalController } from '@ionic/angular';
import { FakeModalController } from '../../../../../testing/fakes/modal-controller.fake.spec';

fdescribe('BalanceModalInjectable', () => {
  let service: BalanceModalInjectable;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
    }).compileComponents();

    service = TestBed.inject(BalanceModalInjectable);
  });

  it('create', () => {
    expect(service.create(null, null, null, null, null, null)).toBeInstanceOf(BalanceModal);
  });
});
