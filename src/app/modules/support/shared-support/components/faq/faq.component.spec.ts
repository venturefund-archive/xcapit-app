import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ABOUT_XCAPIT_OPTIONS } from '../../constants/about-xcapit-account';
import { FaqComponent } from './faq.component';

const faqs = {
  about_xcapit_account: {
    title: 'support.support_account_xcapit.question1',
    answer: 'support.support_account_xcapit.answer1',
    last: false,
  },
  about_wallet: {
    title: 'support.support_wallet.question1',
    answer: 'support.support_wallet.answer1',
    last: false,
  },
  about_buy: {
    title: 'support.support_buy.question1',
    answer: 'support.support_buy.answer1',
    last: false,
  },
  about_binance_investment: {
    title: 'support.support_binance.question1',
    answer: 'support.support_binance.answer1',
    last: false,
  },
  link: {
    title: 'support.support_binance.question3',
    answer: "Test: <a href='http://test'>Haz click aquí</a>",
  },
};

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
      component.faq = ABOUT_XCAPIT_OPTIONS[0];
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change state when input is clicked', () => {
    component.showFirst = false;
    fixture.debugElement.query(By.css('input[name="Faq"]')).nativeElement.click();
    expect(component.showFirst).toBeTruthy();
  });

  // it('should open the link in the app when link is clicked', () => {
  //   component.faq.title = faqs.link.title;
  //   component.faq.answer = faqs.link.answer;
  //   const spyBrowser = spyOn(component.browser, 'open');
  //   fixture.detectChanges();
  //   component.ngAfterViewInit();
  //   const anchor = fixture.debugElement.query(By.css('a'));
  //   const link = anchor.nativeElement.getAttribute('href');
  //   anchor.nativeElement.click();
  //   expect(spyBrowser).toHaveBeenCalledWith({
  //     toolbarColor: '#1c2d5e',
  //     url: 'http://test',
  //   });
  //   expect(link).toEqual('http://test');
  // });

  it('should render properly the question and answer of the faq on support acount page', () => {
    component.faq.title = faqs.about_xcapit_account.title;
    component.faq.answer = faqs.about_xcapit_account.answer;
    const title = fixture.debugElement.query(By.css('ion-text[name="Title"]'));
    const answer = fixture.debugElement.query(By.css('ion-text[name="Answer"]'));
    fixture.detectChanges();
    expect(title.nativeElement.innerHTML).toContain(faqs.about_xcapit_account.title);
    expect(answer.nativeElement.innerHTML).toContain(faqs.about_xcapit_account.answer);
  });

  it('should render properly the question and answer of the faq on support wallet page', () => {
    component.faq.title = faqs.about_wallet.title;
    component.faq.answer = faqs.about_wallet.answer;
    const title = fixture.debugElement.query(By.css('ion-text[name="Title"]'));
    const answer = fixture.debugElement.query(By.css('ion-text[name="Answer"]'));
    fixture.detectChanges();
    expect(title.nativeElement.innerHTML).toContain(faqs.about_wallet.title);
    expect(answer.nativeElement.innerHTML).toContain(faqs.about_wallet.answer);
  });

  it('should render properly the question and answer of the faq on support buy page', () => {
    component.faq.title = faqs.about_buy.title;
    component.faq.answer = faqs.about_buy.answer;
    const title = fixture.debugElement.query(By.css('ion-text[name="Title"]'));
    const answer = fixture.debugElement.query(By.css('ion-text[name="Answer"]'));
    fixture.detectChanges();
    expect(title.nativeElement.innerHTML).toContain(faqs.about_buy.title);
    expect(answer.nativeElement.innerHTML).toContain(faqs.about_buy.answer);
  });

  it('should render properly the question and answer of the faq on support binance investment page', () => {
    component.faq.title = faqs.about_binance_investment.title;
    component.faq.answer = faqs.about_binance_investment.answer;
    const title = fixture.debugElement.query(By.css('ion-text[name="Title"]'));
    const answer = fixture.debugElement.query(By.css('ion-text[name="Answer"]'));
    fixture.detectChanges();
    expect(title.nativeElement.innerHTML).toContain(faqs.about_binance_investment.title);
    expect(answer.nativeElement.innerHTML).toContain(faqs.about_binance_investment.answer);
  });
});
