import { TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { WalletTransactionsService } from '../../services/wallet-transactions/wallet-transactions.service';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';

import { WalletConnectService } from './wallet-connect.service';

describe('WalletConnectService', () => {
  let service: WalletConnectService;
  let modalControllerSpy: any;
  const navControllerSpy: jasmine.SpyObj<NavController> = null;
  const walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService> = null;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);

      TestBed.configureTestingModule({
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    service = TestBed.inject(WalletConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
