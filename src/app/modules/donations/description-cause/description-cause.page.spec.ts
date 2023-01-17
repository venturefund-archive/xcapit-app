import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, NavigationExtras } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { DescriptionCausePage } from './description-cause.page';

const testCause = {
  id: 'unhcr',
  image: 'assets/img/donations/causes/cause_1/image.jpg',
  title: 'UNHCR',
  logo: 'assets/img/donations/causes/cause_1/logo.svg',
  type: 'humanitary',
  title_1: 'donations.description_cause.info.unhcr.title_1',
  title_2: 'donations.description_cause.info.unhcr.title_2',
  title_3: 'donations.description_cause.info.unhcr.title_3',
  description: 'donations.description_cause.info.unhcr.description',
};

describe('DescriptionCausePage', () => {
  let component: DescriptionCausePage;
  let fixture: ComponentFixture<DescriptionCausePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DescriptionCausePage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let activatedRouteSpy: any;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['get']);
      activatedRouteSpy.snapshot = {
        queryParamMap: convertToParamMap({
          cause: 'unhcr',
        }),
      };
      TestBed.configureTestingModule({
        declarations: [DescriptionCausePage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(DescriptionCausePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get correct data on ngOnInit of the cause', () => {
    component.ngOnInit();
    expect(component.data.id).toEqual(testCause.id);
  });

  it('should call trackEvent on trackService when ux_donations_donate Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_donations_donate');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to donate page when button ux_donations_donate is clicked and wallet exist', async () => {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        cause: 'unhcr',
      },
    };
    fixture.debugElement.query(By.css('ion-button[name="ux_donations_donate"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/donations/token-selection'], navigationExtras);
  });

});
