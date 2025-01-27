import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { ErrorWrongAddressWalletPage } from './error-wrong-address-wallet.page';

describe('ErrorWrongAddressWalletPage', () => {
  let component: ErrorWrongAddressWalletPage;
  let fixture: ComponentFixture<ErrorWrongAddressWalletPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let transactionDataServiceSpy: jasmine.SpyObj<TransactionDataService>;

  beforeEach(
    waitForAsync(() => {
      transactionDataServiceSpy = jasmine.createSpyObj('TransactionDataService', null, {
        transactionData: { currency: { value: 'RBTC' } },
      });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [ErrorWrongAddressWalletPage],
        imports: [IonicModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: TransactionDataService, useValue: transactionDataServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ErrorWrongAddressWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to Send Detail Page with coin selected and the address goBackToDetail', () => {
    component.goBackToDetail();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith('/wallets/send/detail/RBTC');
  });
});
