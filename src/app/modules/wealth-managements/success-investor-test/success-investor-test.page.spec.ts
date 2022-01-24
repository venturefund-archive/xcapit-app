import { ApiProfilesService } from './../../profiles/shared-profiles/services/api-profiles/api-profiles.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ApiWealthManagementsService } from '../shared-wealth-managements/services/api-wealth-managements/api-wealth-managements.service';

import { SuccessInvestorTestPage } from './success-investor-test.page';

describe('SuccessInvestorTestPage', () => {
  let component: SuccessInvestorTestPage;
  let fixture: ComponentFixture<SuccessInvestorTestPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessInvestorTestPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let apiWealthManagementsServiceSpy: jasmine.SpyObj<ApiWealthManagementsService>;
  let apiProfilesServiceMock: any;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      apiProfilesServiceMock = {
        crud: jasmine.createSpyObj('CRUD', {
          get: of({ investor_category: 'test' }),
        }),
      };
      TestBed.configureTestingModule({
        declarations: [SuccessInvestorTestPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          UrlSerializer,
          { provide: NavController, useValue: navControllerSpy },
          { provide: ApiWealthManagementsService, useValue: apiWealthManagementsServiceSpy },
          { provide: ApiProfilesService, useValue: apiProfilesServiceMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessInvestorTestPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Close Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Continue Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Home Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Home');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call navigateForward in continue', () => {
    const continueButton = trackClickDirectiveHelper.getByElementByName('ion-button', 'Continue');
    continueButton.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['']);
  });

  it('should call navigateBack in close', () => {
    const closeButton = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    closeButton.nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/tabs/home']);
  });

  it('should call navigateBack in goToHome', () => {
    const goToHomeButton = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Home');
    goToHomeButton.nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/tabs/home']);
  });

  it('should get profile on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(apiProfilesServiceMock.crud.get).toHaveBeenCalledTimes(1);
    expect(component.testResult).toEqual('test');
  });
});
