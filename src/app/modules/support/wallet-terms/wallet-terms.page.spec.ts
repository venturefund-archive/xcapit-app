import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { WalletTermsPage } from './wallet-terms.page';
const faqs = [
  {
    title: 'support.wallet_terms.question1',
    answer: 'support.wallet_terms.answer1',
    last: false,
  },
  {
    title: 'support.wallet_terms.question2',
    answer: 'support.wallet_terms.answer2',
    last: false,
  },
  {
    title: 'support.wallet_terms.question3',
    answer: 'support.wallet_terms.answer3',
    last: false,
  },
];
describe('WalletTermsPage', () => {
  let component: WalletTermsPage;
  let fixture: ComponentFixture<WalletTermsPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [WalletTermsPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletTermsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-faq component', () => {
    component.faqs = faqs;
    fixture.detectChanges();
    const appFaq = fixture.debugElement.queryAll(By.css('app-faq'));
    fixture.detectChanges();
    expect(appFaq.length).toBe(3);
  });
});
