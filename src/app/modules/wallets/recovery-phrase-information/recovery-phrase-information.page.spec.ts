import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { RecoveryPhraseInformationPage } from './recovery-phrase-information.page';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';

describe('RecoveryPhraseInformationPage', () => {
  let component: RecoveryPhraseInformationPage;
  let fixture: ComponentFixture<RecoveryPhraseInformationPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let walletMnemonicServiceSpy: jasmine.SpyObj<WalletMnemonicService>;

  beforeEach(
    waitForAsync(() => {
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
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(RecoveryPhraseInformationPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
