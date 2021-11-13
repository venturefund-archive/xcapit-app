import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { SupportOptionsPage } from './support-options.page';
const options = [
  {
    title: 'support.support_options.title_account',
    description: 'support.support_options.description_account',
    icon: '../../assets/ux-icons/ux-xcapit-account.svg',
    route: '/support/account',
  },
  {
    title: 'support.support_options.title_wallet',
    description: 'support.support_options.description_wallet',
    icon: '../../assets/ux-icons/ux-support-wallet.svg',
    route: '/support/wallet',
  },
  {
    title: 'support.support_options.title_buy',
    description: 'support.support_options.description_buy',
    icon: '../../assets/ux-icons/ux-buy.svg',
    route: '/support/buy',
  },
];

describe('SupportOptionsPage', () => {
  let component: SupportOptionsPage;
  let fixture: ComponentFixture<SupportOptionsPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [SupportOptionsPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(SupportOptionsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-support-options-card component', () => {
    component.options = options;
    fixture.detectChanges();
    const appFaq = fixture.debugElement.queryAll(By.css('app-support-options-card'));
    fixture.detectChanges();
    expect(appFaq.length).toBe(3);
  });
});
