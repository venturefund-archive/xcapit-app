import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { SuccessRemoveWalletPage } from './success-remove-wallet.page';

describe('SuccessRemoveWalletPage', () => {
  let component: SuccessRemoveWalletPage;
  let fixture: ComponentFixture<SuccessRemoveWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessRemoveWalletPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [SuccessRemoveWalletPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessRemoveWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when close is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when go-to-create-wallet is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'go-to-create-wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when go-to-import-wallet is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'go-to-import-wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when go-to-home is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'go-to-home');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate to home when close is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css("ion-button[name='close']"));
    closeButton.nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['tabs/home']);
  });

  it('should navigate to create wallet page when go-to-create-wallet is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css("ion-button[name='go-to-create-wallet']"));
    closeButton.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/create-first/disclaimer']);
  });

  it('should navigate to import wallet page when go-to-import-wallet is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css("ion-button[name='go-to-import-wallet']"));
    closeButton.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/create-first/disclaimer/import']);
  });

    it('should navigate to home when go-to-home is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css("ion-button[name='go-to-home']"));
    closeButton.nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['tabs/home']);
  });
});
