import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { VerifyPhrasePage } from './verify-phrase.page';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { Mnemonic } from '@ethersproject/hdnode';
import { RecoveryPhraseCardComponent } from '../shared-wallets/components/recovery-phrase-card/recovery-phrase-card.component';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { SwiperModule } from 'swiper/angular';
import { WalletBackupService } from '../shared-wallets/services/wallet-backup/wallet-backup.service';


describe('VerifyPhrasePage', () => {
  let component: VerifyPhrasePage;
  let fixture: ComponentFixture<VerifyPhrasePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<VerifyPhrasePage>;
  let walletMnemonicServiceSpy;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;
  
  const phraseTrue = [
    {order:1,value:'test'},
    {order:2,value:'phrase'},
    {order:3,value:'other'}
  ];
  const phraseFalse = [
    {order:1,value:'test'},
    {order:2,value:'phrase'},
    {order:3,value:'word'}
  ];
  const testMnemonic: Mnemonic = {
    locale: 'en',
    path: '',
    phrase: 'test phrase other word number another rooster keyboard confort destroy jingle july',
  };  

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      walletMnemonicServiceSpy = jasmine.createSpyObj(
        'WalletMnemonicService',
        {
          getMnemonic: testMnemonic,
          clearMnemonic: ''
        },
        { mnemonic: testMnemonic }
      );
      storageSpy = jasmine.createSpyObj('IonicStorageService', {
        set: Promise.resolve(),
        get: Promise.resolve(true),
      });

      walletBackupServiceSpy = jasmine.createSpyObj('WalletBackupService', {
        disableModal: Promise.resolve(),
      });

      TestBed.configureTestingModule({
        declarations: [VerifyPhrasePage, FakeTrackClickDirective, RecoveryPhraseCardComponent],
        imports: [IonicModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot(), SwiperModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
          { provide: IonicStorageService, useValue: storageSpy },
          { provide: WalletBackupService, useValue: walletBackupServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(VerifyPhrasePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize wordsToVerify and phrase splitted', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.wordsToVerify.length).toEqual(3);
  });
  
  it('should push word in verificationPhrase when addWord is called',  () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-recovery-phrase-card')).triggerEventHandler('useButtonClicked', 'test');
    fixture.detectChanges();
    expect(component.verificationPhrase).toEqual(['test']);
    expect(component.allWordsSelected).toBeFalse();
  });

  it('should erase word and slide prev when Remove Word button is clicked', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const spy = spyOn(component.recoveryPhraseComponent, 'enable');
    fixture.debugElement.query(By.css('app-recovery-phrase-card')).triggerEventHandler('useButtonClicked', 'test');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Remove Word"]')).nativeElement.click();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()])
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.verificationPhrase).toEqual([]);
    expect(component.allWordsSelected).toBeFalse();
  });

  it('should navigate to /tabs/wallets, set protectedWallet into storage and clear mnemonic from service if the phrase is valid', async () => {
    component.ionViewWillEnter()
    component.wordsToVerify = phraseTrue;
    component.allWordsSelected = true;
    component.phrase = testMnemonic.phrase.split(' ');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_protect_finalize"]')).nativeElement.click();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()])

    expect(storageSpy.set).toHaveBeenCalledOnceWith('protectedWallet', true);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/tabs/wallets']);
    expect(walletBackupServiceSpy.disableModal).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when ux_protect_finalize clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_protect_finalize');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to /wallets/failed-mnemonic if the phrase is invalid', () => {
    component.wordsToVerify = phraseFalse;
    component.allWordsSelected = true;
    component.phrase = testMnemonic.phrase.split(' ');
    fixture.detectChanges();
    fixture.debugElement.query(By.css("ion-button[name='ux_protect_finalize']")).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/failed-mnemonic']);
  });

  it('should clear password and mnemonic on leave', async () => {
    component.ionViewWillLeave();
    expect(walletMnemonicServiceSpy.clearMnemonic).toHaveBeenCalledTimes(1);
  });

  it('should navigate /tabs/wallets when the phrase is valid', async () => {
    storageSpy.get.and.resolveTo()
    component.ionViewWillEnter()
    component.wordsToVerify = phraseTrue;
    component.allWordsSelected = true;
    component.phrase = testMnemonic.phrase.split(' ');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_protect_finalize"]')).nativeElement.click();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()])
    
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/tabs/wallets']);    
  });

});
