import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { RecoveryPhrasePage } from './recovery-phrase.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { Mnemonic } from '@ethersproject/hdnode';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const testMnemonic: Mnemonic = {
  locale: 'en',
  path: '',
  phrase: 'test mnemonic phrase',
};

describe('RecoveryPhrasePage', () => {
  let component: RecoveryPhrasePage;
  let fixture: ComponentFixture<RecoveryPhrasePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RecoveryPhrasePage>;
  let navController: NavController;
  let walletMnemonicServiceSpy;

  beforeEach(
    waitForAsync(() => {
      walletMnemonicServiceSpy = jasmine.createSpyObj('WalletMnemonicService', {
        newMnemonic: () => testMnemonic,
        mnemonic: testMnemonic,
      });
      TestBed.configureTestingModule({
        declarations: [RecoveryPhrasePage, FakeTrackClickDirective],
        imports: [IonicModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerMock },
          { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(RecoveryPhrasePage);
      component = fixture.componentInstance;
      component.mnemonic = testMnemonic;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      navController = TestBed.inject(NavController);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when Next clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Next');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should go to verify phrase when goToVerifyPhrase called', () => {
    const spy = spyOn(navController, 'navigateForward');
    component.goToVerifyPhrase();
    expect(walletMnemonicServiceSpy.mnemonic).toEqual(testMnemonic);
    expect(spy).toHaveBeenCalledWith(['/wallets/create-first/verify-phrase']);
  });

  it('should generate new mnemonic on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(walletMnemonicServiceSpy.newMnemonic).toHaveBeenCalledTimes(1);
  });
});
