import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { SimplifiedWalletSubheaderButtonsComponent } from './simplified-wallet-subheader-buttons.component';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TokenOperationDataService } from 'src/app/modules/fiat-ramps/shared-ramps/services/token-operation-data/token-operation-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SimplifiedWalletSubheaderButtonsComponent', () => {
  let component: SimplifiedWalletSubheaderButtonsComponent;
  let fixture: ComponentFixture<SimplifiedWalletSubheaderButtonsComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    fakeModalController = new FakeModalController(null, {});
    modalControllerSpy = fakeModalController.createSpy();

    tokenOperationDataServiceSpy = jasmine.createSpyObj(
      'TokenOperationDataService',
      {
        clean: Promise.resolve(),
        set: Promise.resolve(),
      },
      {
        tokenOperationData: { asset: 'USDC', network: 'MATIC', country: 'ECU' },
      }
    );
    TestBed.configureTestingModule({
      declarations: [SimplifiedWalletSubheaderButtonsComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SimplifiedWalletSubheaderButtonsComponent);
    component = fixture.componentInstance;
    component.token = 'USDC'
    component.blockchain = 'MATIC'
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to purchases home page and clean asset data when ux_go_to_buy button is clicked', () => {
    fixture.debugElement.query(By.css("app-icon-button-card[name='ux_go_to_buy']")).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('fiat-ramps/purchases');
    expect(tokenOperationDataServiceSpy.clean).toHaveBeenCalledTimes(1);
    expect(tokenOperationDataServiceSpy.set).toHaveBeenCalledOnceWith({
      asset: 'USDC',
      network: 'MATIC',
    });
  });

  it('should emit event when ux_go_to_warranty button is clicked', () => {
    const spy = spyOn(component.openWarrantyModal, 'emit');
    fixture.debugElement.query(By.css("app-icon-button-card[name='ux_go_to_warrant']")).nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to receive detail when ux_go_to_receive button is clicked', () => {
    fixture.debugElement.query(By.css("app-icon-button-card[name='ux_go_to_receive']")).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('wallets/receive/detail', {
      queryParams: {
        asset: 'USDC',
        network: 'MATIC',
      },
    });
  });

  it('should open switch profile type modal when ux_go_to_send button is clicked', () => {
    fixture.debugElement.query(By.css("app-icon-button-card[name='ux_go_to_send']")).nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
