import { SUCCESS_TYPES } from './../../../shared/components/success-content/success-types.constant';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
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
      TestBed.configureTestingModule({
        declarations: [SuccessRegisterApikeysBeginnerPage],
        imports: [IonicModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessRegisterApikeysBeginnerPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data on init', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.data).toEqual(SUCCESS_TYPES.apikeys_register_success_beginner);
  });
});
