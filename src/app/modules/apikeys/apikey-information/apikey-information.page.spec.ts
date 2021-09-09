import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { ApikeyInformationPage } from './apikey-information.page';

describe('ApikeyInformationPage', () => {
  let component: ApikeyInformationPage;
  let fixture: ComponentFixture<ApikeyInformationPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ApikeyInformationPage>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [ApikeyInformationPage, TrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [TrackClickDirective, { provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(ApikeyInformationPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  ['Have API Key', 'Doesnt Have API Key'].forEach((name) => {
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

  it('should navigate to Register API Key when Have API Key is clicked', () => {
    fixture.debugElement.query(By.css('div[name="Have API Key"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/apikeys/register');
  });

  it('should render properly the existing account button card', () => {
    const cardInfoTitleEl = fixture.debugElement.query(By.css('.existing_apikey .apnf__cards__card__info__title'));
    expect(cardInfoTitleEl.nativeElement.innerHTML).toContain('apikeys.apikey_information.cards.have_apikey.title');

    const cardInfoDescriptionEl = fixture.debugElement.query(
      By.css('.existing_apikey .apnf__cards__card__info__description')
    );
    expect(cardInfoDescriptionEl.nativeElement.innerHTML).toContain(
      'apikeys.apikey_information.cards.have_apikey.description'
    );

    const cardInfoIconEl = fixture.debugElement.query(By.css('.existing_apikey .apnf__cards__card__chevron'));
    expect(cardInfoIconEl.nativeElement.innerHTML).toContain('ion-icon');
  });

  it('should render properly the non existing apikey button card', () => {
    const cardInfoTitleEl = fixture.debugElement.query(By.css('.non_existing_apikey .apnf__cards__card__info__title'));
    expect(cardInfoTitleEl.nativeElement.innerHTML).toContain(
      'apikeys.apikey_information.cards.dont_have_apikey.title'
    );

    const cardInfoDescriptionEl = fixture.debugElement.query(
      By.css('.non_existing_apikey .apnf__cards__card__info__description')
    );
    expect(cardInfoDescriptionEl.nativeElement.innerHTML).toContain(
      'apikeys.apikey_information.cards.dont_have_apikey.description'
    );

    const cardInfoIconEl = fixture.debugElement.query(By.css('.non_existing_apikey .apnf__cards__card__chevron'));
    expect(cardInfoIconEl.nativeElement.innerHTML).toContain('ion-icon');
  });

  it('should render properly the title and description text of the page', () => {
    const titleEl = fixture.debugElement.query(By.css('.apnf__title ion-text'));
    expect(titleEl.nativeElement.innerHTML).toContain('apikeys.apikey_information.title');

    const descriptionEl = fixture.debugElement.query(By.css('.apnf__description ion-text'));
    expect(descriptionEl.nativeElement.innerHTML).toContain('apikeys.apikey_information.description');
  });
});
