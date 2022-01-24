import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { RecoveryPhraseNoWalletPage } from './recovery-phrase-no-wallet.page';

describe('RecoveryPhraseNoWalletPage', () => {
  let component: RecoveryPhraseNoWalletPage;
  let fixture: ComponentFixture<RecoveryPhraseNoWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RecoveryPhraseNoWalletPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [RecoveryPhraseNoWalletPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(RecoveryPhraseNoWalletPage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when Go To Import Wallet clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Import Wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call appTrackEvent on trackService when Go To Create Wallet clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Create Wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call appTrackEvent on trackService when Go To FAQ clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To FAQ');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to import wallet page when button Go To Import Wallet clicked', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Go To Import Wallet"]'));
    buttonEl.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/create-first/disclaimer', 'import']);
  });

  it('should navigate to create wallet page when button Go To Create Wallet clicked', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Go To Create Wallet"]'));
    buttonEl.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/create-first/disclaimer']);
  });

  it('should navigate to support wallet page when button Go To FAQ clicked', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Go To FAQ"]'));
    buttonEl.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['support/wallet']);
  });
});
