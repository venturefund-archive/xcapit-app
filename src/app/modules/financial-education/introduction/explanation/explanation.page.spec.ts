import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ExplanationPage } from './explanation.page';

describe('ExplanationPage', () => {
  let component: ExplanationPage;
  let fixture: ComponentFixture<ExplanationPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ExplanationPage>;
  let storageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  beforeEach(
    waitForAsync(() => {
      fakeActivatedRoute = new FakeActivatedRoute({ mode: 'rule' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();

      storageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
        set: Promise.resolve(),
      });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', { trackEvent: Promise.resolve(true) });
      TestBed.configureTestingModule({
        declarations: [ExplanationPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: IonicStorageService, useValue: storageServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ExplanationPage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate back to financial education home when mode is rule', () => {
    component.ionViewWillEnter();
    const backButtonEl = fixture.debugElement.query(By.css('ion-back-button'));
    backButtonEl.nativeElement.click();

    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('tabs/financial-education');
  });

  it('should navigate back to financial freedom page when mode is empty', () => {
    fakeActivatedRoute.modifySnapshotParams({ mode: '' });

    component.ionViewWillEnter();
    const backButtonEl = fixture.debugElement.query(By.css('ion-back-button'));
    backButtonEl.nativeElement.click();

    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(
      'financial-education/introduction/financial-freedom'
    );
  });

  it('should call appTrackEvent on trackService when ux_education_screenview_intro_2 is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_education_screenview_intro_2');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate and set storage when start button is clicked', () => {
    fixture.debugElement.query(By.css('.ep__button ion-button')).nativeElement.click();

    fixture.detectChanges();

    expect(storageServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('tabs/financial-education');
  });

  it('should render app-explanation-item component', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const componentEl = fixture.debugElement.queryAll(By.css('app-explanation-item'));
    fixture.detectChanges();
    expect(componentEl).toBeTruthy();
  });

  it('should render app-share-education component', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const componentEl = fixture.debugElement.queryAll(By.css('app-share-education'));
    fixture.detectChanges();
    expect(componentEl).toBeTruthy();
  });
});
