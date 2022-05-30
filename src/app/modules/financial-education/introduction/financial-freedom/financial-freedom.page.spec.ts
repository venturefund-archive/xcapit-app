import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { FinancialFreedomPage } from './financial-freedom.page';

describe('FinancialFreedomPage', () => {
  let component: FinancialFreedomPage;
  let fixture: ComponentFixture<FinancialFreedomPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FinancialFreedomPage>;
  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy',{ trackEvent: Promise.resolve(true),})

    TestBed.configureTestingModule({
      declarations: [ FinancialFreedomPage,  FakeTrackClickDirective ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers:[{ provide: TrackService, useValue: trackServiceSpy},{ provide: NavController, useValue: navControllerSpy },]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialFreedomPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate to Explanation when button is clicked', () => {
    fixture.debugElement.query(By.css('.ff__button ion-button')).nativeElement.click();

    fixture.detectChanges();
    
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('financial-education/introduction/explanation');
  });

  it('should call appTrackEvent on trackService when ux_education_next is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_education_next');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render properly', () => {
    const imgEl = fixture.debugElement.query(By.css('.ff__content__img img'));
    const titleEl = fixture.debugElement.query(By.css('.ff__content__title ion-text'));
    const subtitleEl = fixture.debugElement.query(By.css('.ff__content__subtitle ion-text'));
    expect(imgEl.attributes.src).toContain('assets/img/financial-education/financial_freedom.svg');
    expect(titleEl.nativeElement.innerHTML).toContain('financial_education.introduction.financial_freedom.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('financial_education.introduction.financial_freedom.subtitle');
  });

});
