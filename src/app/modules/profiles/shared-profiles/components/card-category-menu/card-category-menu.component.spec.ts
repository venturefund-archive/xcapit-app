import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { CardCategoryMenuComponent } from './card-category-menu.component';
import { MenuCategory } from '../../interfaces/menu-category.interface';

const itemMenu: MenuCategory = {
  category_title: 'profiles.user_profile_menu.category_help',
  icon: 'assets/ux-icons/ux-support.svg',
  items: [
    {
      name: 'Faq',
      text: 'profiles.user_profile_menu.faq_help',
      route: '/support/options',
      type: 'link',
    },
    {
      name: 'Support',
      text: 'profiles.user_profile_menu.support_help',
      route: 'tickets/create-support-ticket',
      type: 'link',
    },
    {
      name: 'RecoveryPhrase',
      text: 'profiles.user_profile_menu.security_phrase',
      route: '/wallets/recovery/info',
      type: 'link',
    },
  ],
};

describe('CardItemMenuComponent', () => {
  let component: CardCategoryMenuComponent;
  let fixture: ComponentFixture<CardCategoryMenuComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<CardCategoryMenuComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      walletServiceSpy = jasmine.createSpyObj('WalletService', { walletExist: Promise.resolve(true) });
      TestBed.configureTestingModule({
        declarations: [CardCategoryMenuComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(CardCategoryMenuComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component.category = itemMenu;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when elements with the directive are clicked', () => {
    fixture.detectChanges();
    const elms = trackClickDirectiveHelper.getAllElementsWithTheDirective();
    for (const el of elms) {
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    }
    expect(elms.length).toBe(3);
  });

  for (const item of itemMenu.items) {
    it(`should navigate to ${item.route} when button ${item.name} is clicked`, async () => {
      const button = fixture.debugElement.query(By.css(`ion-button#${item.name}`));
      button.nativeElement.click();
      await fixture.whenStable();
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(`${item.route}`);
    });
  }

  it('should navigate to "/wallets/recovery/info-no-wallet" when recoveryPhrase is clicked and there is not wallet', async () => {
    walletServiceSpy.walletExist.and.resolveTo(false);
    const button = fixture.debugElement.query(By.css(`ion-button#RecoveryPhrase`));
    button.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/recovery/info-no-wallet');
  });
});
