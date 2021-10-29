import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { SupportBuyPage } from './support-buy.page';

const faqs = [
  {
    title: 'support.support_buy.question1',
    answer: 'support.support_buy.answer1',
    last: false,
  },
  {
    title: 'support.support_buy.question2',
    answer: 'support.support_buy.answer2',
    last: false,
  },
  {
    title: 'support.support_buy.question3',
    answer: 'support.support_buy.answer3',
    last: false,
  },
];

describe('SupportBuyPage', () => {
  let component: SupportBuyPage;
  let fixture: ComponentFixture<SupportBuyPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [SupportBuyPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(SupportBuyPage);
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
