import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { UserRegisterStepCardComponent } from './user-register-step-card.component';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';

describe('UserRegisterStepCardComponent', () => {
  let component: UserRegisterStepCardComponent;
  let fixture: ComponentFixture<UserRegisterStepCardComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UserRegisterStepCardComponent>;
  let fakeData: any;

  beforeEach(waitForAsync(() => {
    fakeData = {
      action: true,
      order: '1',
      title: 'fakeTitle',
      subtitle: 'fakeSubtitle',
      url: 'fakeUrl',
      name: 'ux_buy_kripton_details',
      disabled: false,
      completed: false,
    };
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [UserRegisterStepCardComponent, FakeTrackClickDirective, FakeFeatureFlagDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: NavController, useValue: navControllerSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRegisterStepCardComponent);
    component = fixture.componentInstance;
    component.step = fakeData;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const numberEl = fixture.debugElement.query(By.css('div.ursc__wrapper__step > div.incompleteInfo > ion-text'));
    const titleEl = fixture.debugElement.query(
      By.css('div.ursc__wrapper__content > ion-text.ursc__wrapper__content__title')
    );
    const subtitleEl = fixture.debugElement.query(By.css('div.subtitle ion-text'));
    const iconEl = fixture.debugElement.query(By.css('div.ursc__wrapper__action > ion-icon'));

    expect(numberEl.nativeElement.innerHTML).toContain(fakeData.order);
    expect(titleEl.nativeElement.innerHTML).toContain(fakeData.title);
    expect(subtitleEl.nativeElement.innerHTML).toContain(fakeData.subtitle);
    expect(iconEl.attributes['ng-reflect-name']).toContain('chevron-forward-outline');
  });

  it('should navigate if item is not completed, have url and was clicked', () => {
    const itemEl = fixture.debugElement.query(By.css('ion-item.ursc'));

    itemEl.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(fakeData.url);
  });

  it('should emit an event if it is not complete, has no url but has the action variable set to true and was clicked', () => {
    component.step.url = null
    const spy = spyOn(component.cardClicked, 'emit');
    const itemEl = fixture.debugElement.query(By.css('ion-item.ursc'));

    itemEl.nativeElement.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent if item is not disabled and was clicked', () => {
    component.step.disabled = false;
    const el = trackClickDirectiveHelper.getElement('ion-item');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
