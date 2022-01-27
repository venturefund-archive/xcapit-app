import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { TutorialApikeysPage } from './tutorial-apikeys.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('TutorialApikeysPage', () => {
  let component: TutorialApikeysPage;
  let fixture: ComponentFixture<TutorialApikeysPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TutorialApikeysPage>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();

      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        declarations: [TutorialApikeysPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(TutorialApikeysPage);
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
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/apikeys/tutorial/register');
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

  it('should open modal when Doesnt Have API Key button is clicked', () => {
    const buttonEl = fixture.debugElement.query(By.css('div[name="Doesnt Have API Key"]')).nativeElement;
    buttonEl.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should navigate to Register API Key when modal is closed using the Done button', async () => {
    fakeModalController.modifyReturns({ role: 'success' }, null);
    await component.nonExistingAPIKey();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/apikeys/tutorial/register');
  });

  it('should not navigate to Register API Key when modal is closed using the Close button', async () => {
    fakeModalController.modifyReturns({ role: 'cancel' }, null);
    await component.nonExistingAPIKey();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
  });

  it('should navigate to Whats an API Key when Need Help button is clicked', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Need Help"]')).nativeElement;
    buttonEl.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/apikeys/whats-an-api-key');
  });
});
