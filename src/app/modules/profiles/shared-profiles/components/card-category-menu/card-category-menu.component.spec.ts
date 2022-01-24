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
import { MenuCategory } from '../../interfaces/menu-category.interface';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';

const itemMenu: MenuCategory = {
  category_title: 'profiles.user_profile_menu.category_help',
  icon: 'assets/ux-icons/ux-support.svg',
  showCategory: true,
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
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      fakeWalletService = new FakeWalletService(true, {});
      walletServiceSpy = fakeWalletService.createSpy();
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
    component.category.showCategory = true;
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
      component.category.showCategory = true;
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css(`ion-button#${item.name}`));
      button.nativeElement.click();
      await fixture.whenStable();
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(`${item.route}`);
    });
  }

  it('should render category when atributte showCategory is true', async () => {
    await fixture.whenRenderingDone();
    const divEl = fixture.debugElement.query(By.css('div.ux-card'));
    expect(divEl).toBeTruthy();
  });

  it('should not render category when atributte showCategory is false', async () => {
    component.category.showCategory = false;
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div.ux-card'));
    expect(divEl).toBeFalsy();
  });
});
