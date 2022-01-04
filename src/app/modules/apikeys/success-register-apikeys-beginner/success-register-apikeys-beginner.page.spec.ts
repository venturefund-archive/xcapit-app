import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { SuccessRegisterApikeysBeginnerPage } from './success-register-apikeys-beginner.page';

describe('SuccessRegisterApikeysBeginnerPage', () => {
  let component: SuccessRegisterApikeysBeginnerPage;
  let fixture: ComponentFixture<SuccessRegisterApikeysBeginnerPage>;

  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;

  beforeEach(
    waitForAsync(() => {
      fakeWalletService = new FakeWalletService(true, {});
      walletServiceSpy = fakeWalletService.createSpy();
      TestBed.configureTestingModule({
        declarations: [SuccessRegisterApikeysBeginnerPage],
        imports: [IonicModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: WalletService, useValue: walletServiceSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessRegisterApikeysBeginnerPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set "/fiat-ramps/moonpay" on success types when wallet exist', () => {
    expect(SUCCESS_TYPES.apikeys_register_success_begginer.urlThirdAction).toEqual('/fiat-ramps/moonpay');
  });

  it('should set "/fiat-ramps/no-wallet" on success types when wallet not exist', async () => {
    fakeWalletService.modifyReturns(false, {});
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    console.log(component.existWallet);
    expect(SUCCESS_TYPES.apikeys_register_success_begginer.urlThirdAction).toEqual('/fiat-ramps/no-wallet');
  });
});
