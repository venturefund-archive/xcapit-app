import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';

import { ErrorTestPage } from './error-test.page';
import { ActivatedRoute } from '@angular/router';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';

const testData = {
  image: '/assets/img/financial-education/test.svg',
  textPrimary: 'financial_education.error_test.textPrimary',
  textSecondary: 'financial_education.error_test.textSecondary',
  namePrimaryAction: 'financial_education.error_test.namePrimaryAction',
  trackClickEventNamePrimaryAction: 'ux_education_retry_module',
  urlPrimaryAction: '',
  nameSecondaryAction: 'financial_education.error_test.nameSecondaryAction',
  urlSecondaryAction: '/financial-education/home',
  trackClickEventNameSecondaryAction: 'ux_education_go_to_menu',
  nameThirdAction: 'financial_education.error_test.nameThirdAction',
  urlThirdAction: '',
};

fdescribe('ErrorTestPage', () => {
  let component: ErrorTestPage;
  let fixture: ComponentFixture<ErrorTestPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(
    waitForAsync(() => {
      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', { trackEvent: Promise.resolve(true) });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['get']);
      TestBed.configureTestingModule({
        declarations: [ErrorTestPage],
        imports: [IonicModule.forRoot()],
        providers: [
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ErrorTestPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.data = testData;
    const appErrorContentEl = fixture.debugElement.query(By.css('app-success-content'));
    expect(appErrorContentEl).toBeTruthy();
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
