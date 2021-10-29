import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';

import { RecoveryPhraseInformationPage } from './recovery-phrase-information.page';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { By } from '@angular/platform-browser';

describe('RecoveryPhraseInformationPage', () => {
  let component: RecoveryPhraseInformationPage;
  let fixture: ComponentFixture<RecoveryPhraseInformationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RecoveryPhraseInformationPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let walletMnemonicServiceSpy: jasmine.SpyObj<WalletMnemonicService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      walletMnemonicServiceSpy = jasmine.createSpyObj('WalletMnemonicService', {});
      TestBed.configureTestingModule({
        declarations: [RecoveryPhraseInformationPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          TranslateService,
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(RecoveryPhraseInformationPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Continue Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open password modal when user clicks Continue Button', () => {
    fixture.debugElement.query(By.css('ion-button[name="Continue"]')).nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
