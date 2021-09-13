import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TutorialExchangePage } from './tutorial-exchange.page';

describe('TutorialExchangePage', () => {
  let component: TutorialExchangePage;
  let fixture: ComponentFixture<TutorialExchangePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TutorialExchangePage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [TutorialExchangePage, TrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [TrackClickDirective, { provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(TutorialExchangePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  ['Have Binance Account', 'Doesnt Have Binance Account'].forEach((name) => {
    it(`should call trackEvent when ${name} is clicked`, () => {
      const el = trackClickDirectiveHelper.getByElementByName('div', `${name}`);
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it(`should call trackEvent when Need Help is clicked`, () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Need Help');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to API Key information when Have Binance Account is clicked', () => {
    fixture.debugElement.query(By.css('div[name="Have Binance Account"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/apikeys/tutorial-apikeys');
  });

  it('should navigate to Create Support Ticket Page when Need Help is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Need Help"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tickets/create-support-ticket');
  });

  it('should render properly the existing account button card', () => {
    const ExistingAccountCardInfoTitleEl = fixture.debugElement.query(
      By.css('.existing_account .aei__cards__card__info__title')
    );
    expect(ExistingAccountCardInfoTitleEl.nativeElement.innerHTML).toContain(
      'apikeys.exchange_information.cards.have_exchange_account.title'
    );

    const ExistingAccountCardInfoDescriptionEl = fixture.debugElement.query(
      By.css('.existing_account .aei__cards__card__info__description')
    );
    expect(ExistingAccountCardInfoDescriptionEl.nativeElement.innerHTML).toContain(
      'apikeys.exchange_information.cards.have_exchange_account.description'
    );

    const ExistingAccountCardInfoIconEl = fixture.debugElement.query(
      By.css('.existing_account .aei__cards__card__chevron')
    );
    expect(ExistingAccountCardInfoIconEl.nativeElement.innerHTML).toContain('ion-icon');
  });

  it('should render properly the non existing account button card', () => {
    const cardInfoTitleEl = fixture.debugElement.query(By.css('.non_existing_account .aei__cards__card__info__title'));
    expect(cardInfoTitleEl.nativeElement.innerHTML).toContain(
      'apikeys.exchange_information.cards.dont_have_exchange_account.title'
    );

    const cardInfoDescriptionEl = fixture.debugElement.query(
      By.css('.non_existing_account .aei__cards__card__info__description')
    );
    expect(cardInfoDescriptionEl.nativeElement.innerHTML).toContain(
      'apikeys.exchange_information.cards.dont_have_exchange_account.description'
    );

    const cardInfoIconEl = fixture.debugElement.query(By.css('.non_existing_account .aei__cards__card__chevron'));
    expect(cardInfoIconEl.nativeElement.innerHTML).toContain('ion-icon');
  });

  it('should render properly the title and description text of the page', () => {
    const titleEl = fixture.debugElement.query(By.css('.aei__title ion-text'));
    expect(titleEl.nativeElement.innerHTML).toContain('apikeys.exchange_information.title');

    const descriptionEl = fixture.debugElement.query(By.css('.aei__description ion-text'));
    expect(descriptionEl.nativeElement.innerHTML).toContain('apikeys.exchange_information.description');
  });
});
