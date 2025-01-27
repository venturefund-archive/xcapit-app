import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { SuccessRemoveWalletPage } from './success-remove-wallet.page';

describe('SuccessRemoveWalletPage', () => {
  let component: SuccessRemoveWalletPage;
  let fixture: ComponentFixture<SuccessRemoveWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessRemoveWalletPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(waitForAsync(() => {
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
  }));

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

  it('should call trackEvent on trackService when go_to_create_wallet is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'go_to_create_wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when go_to_import_wallet is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'go_to_import_wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate to on boarding when close is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css("ion-button[name='close']"));
    closeButton.nativeElement.click();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('/users/on-boarding');
  });

  it('should navigate to create wallet page when go_to_create_wallet is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css("ion-button[name='go_to_create_wallet']"));
    closeButton.nativeElement.click();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('/wallets/select-wallet-type');
  });

  it('should navigate to import wallet page when go_to_import_wallet is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css("ion-button[name='go_to_import_wallet']"));
    closeButton.nativeElement.click();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('/wallets/create-first/disclaimer/import');
  });
});
