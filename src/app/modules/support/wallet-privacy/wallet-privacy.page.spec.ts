import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { WalletPrivacyPage } from './wallet-privacy.page';
const faqs = [
  {
    title: 'support.wallet_privacy.question1',
    answer: 'support.wallet_privacy.answer1',
    last: false,
  },
  {
    title: 'support.wallet_privacy.question2',
    answer: 'support.wallet_privacy.answer2',
    last: false,
  },
  {
    title: 'support.wallet_privacy.question3',
    answer: 'support.wallet_privacy.answer3',
    last: false,
  },
];
describe('WalletPrivacyPage', () => {
  let component: WalletPrivacyPage;
  let fixture: ComponentFixture<WalletPrivacyPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [WalletPrivacyPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletPrivacyPage);
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
