import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { FaqComponent } from './faq.component';
const faq = [
  {
    title: 'support.support_account_xcapit.question3',
    answer: 'support.support_account_xcapit.answer3',
    last: false,
    href: '/apikeys/how-create-binance-account',
    link_text: 'support.support_account_xcapit.link_text3',
  },
];

describe('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [FaqComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(FaqComponent);
      component = fixture.componentInstance;
      component.answer = faq[0];
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to how-create-binance-account when link is clicked', () => {
    const link = fixture.debugElement.query(By.css('a.link_text'));
    const href = link.nativeElement.attributes.href.value;
    expect(href).toEqual(faq[0].href);
  });
});
