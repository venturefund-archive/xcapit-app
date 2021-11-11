import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { WalletTermsOptionsPage } from './wallet-terms-options.page';
const options = [
  {
    title: 'support.wallet-terms-options.title_terms',
    description: '',
    icon: '../../assets/ux-icons/wallet-terms.svg',
    route: '/support/wallet-info/terms',
  },
  {
    title: 'support.wallet-terms-options.title_privacy_politics',
    description: '',
    icon: '../../assets/ux-icons/privacy.svg',
    route: '/support/wallet-info/privacy',
  },
];
describe('WalletTermsOptionsPage', () => {
  let component: WalletTermsOptionsPage;
  let fixture: ComponentFixture<WalletTermsOptionsPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [WalletTermsOptionsPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletTermsOptionsPage);
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
    expect(appFaq.length).toBe(2);
  });
});
