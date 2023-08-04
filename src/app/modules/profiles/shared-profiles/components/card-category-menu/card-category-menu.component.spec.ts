import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { CardCategoryMenuComponent } from './card-category-menu.component';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';
import { rawMenuCategoryHelp, rawMenuCategoryWalletConnect } from '../../models/menu-category.raw';
import { rawMenuItemCommunity, rawMenuItemSupport } from '../../models/menu-item/menu-items.raw';

describe('CardCategoryMenuComponent', () => {
  let component: CardCategoryMenuComponent;
  let fixture: ComponentFixture<CardCategoryMenuComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<CardCategoryMenuComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', { connected: false });
    fakeWalletService = new FakeWalletService(true, {});
    walletServiceSpy = fakeWalletService.createSpy();
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      declarations: [CardCategoryMenuComponent, FakeTrackClickDirective, FakeFeatureFlagDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CardCategoryMenuComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component.category = structuredClone({
      ...rawMenuCategoryHelp,
      items: [
        { ...rawMenuItemSupport, visible: true },
        { ...rawMenuItemCommunity, visible: true },
      ],
    });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when elements with the directive are clicked', () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getAllElementsWithTheDirective()[0];
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate when button item is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button#Support')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(rawMenuItemSupport.route);
  });

  it('should open browser when button item is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button#Community')).nativeElement.click();
    await fixture.whenStable();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: rawMenuItemCommunity.route });
  });

  it('should call trackEvent on trackService when item with the directive item is clicked', async () => {
    const button = fixture.debugElement.query(By.css('ion-button#Support'));
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render category when attribute showCategory is true', () => {
    component.category.visible = true;
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div.ux-card'));
    expect(divEl).toBeTruthy();
  });

  it('should not render category when attribute showCategory is false', async () => {
    component.category.visible = false;
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div.ux-card'));
    expect(divEl).toBeFalsy();
  });

  it('should navigate to "/wallets/no-wallet" when WalletConnect is clicked and there is not wallet', async () => {
    component.category = rawMenuCategoryWalletConnect;
    fixture.detectChanges();
    walletServiceSpy.walletExist.and.resolveTo(false);
    const button = fixture.debugElement.query(By.css(`ion-button#WalletConnect`));
    button.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/no-wallet');
  });

  it('should navigate to "/wallets/wallet-connect/connection-detail" when WalletConnect is clicked and there is wallet and walletconnect is connected', async () => {
    component.category = rawMenuCategoryWalletConnect;
    walletServiceSpy.walletExist.and.resolveTo(true);
    walletConnectServiceSpy.connected = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css(`ion-button#WalletConnect`));
    button.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/wallet-connect/connection-detail');
  });

  it('should navigate to "/wallets/wallet-connect/new-connection" when WalletConnect is clicked and there is wallet and walletconnect is not connected', async () => {
    component.category = rawMenuCategoryWalletConnect;
    walletServiceSpy.walletExist.and.resolveTo(true);
    walletConnectServiceSpy.connected = false;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css(`ion-button#WalletConnect`));
    button.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/wallet-connect/new-connection');
  });

  it('should show WalletConnect disconnected', () => {
    component.category = rawMenuCategoryWalletConnect;
    walletServiceSpy.walletExist.and.resolveTo(true);
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('div.card-title__legend > ion-label'));
    const iconEl = fixture.debugElement.query(By.css('div.card-title__legend > ion-icon'));

    expect(labelEl).toBeTruthy();
    expect(labelEl.nativeElement.innerHTML).toContain('profiles.user_profile_menu.disconnected_walletconnect');
    expect(iconEl).toBeTruthy();
    expect(iconEl.nativeElement.color).toEqual('dangerdark');
  });
});
