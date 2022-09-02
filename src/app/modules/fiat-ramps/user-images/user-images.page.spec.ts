import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { UserImagesPage } from './user-images.page';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { TrackService } from 'src/app/shared/services/track/track.service';

const formData = {
  valid: {
    front_document: {
      type: 'front_document',
      image: 'assets/test_image.svg',
    },
    back_document: {
      type: 'back_document',
      image: 'assets/test_image.svg',
    },
    billing: {
      type: 'billing',
      image: 'assets/test_image.svg',
    },
  },
  invalid: {
    front_document: {
      type: 'front_document',
      image: '',
    },
    back_document: {
      type: 'back_document',
      image: '',
    },
    billing: {
      type: 'billing',
      image: '',
    },
  },
};

describe('UserImagesPage', () => {
  let component: UserImagesPage;
  let fixture: ComponentFixture<UserImagesPage>;
  let fiatRampsServiceSpy: any;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UserImagesPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        registerUserImages: of({}),
      });
      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy',{
        trackEvent: Promise.resolve(true),
      })

      TestBed.configureTestingModule({
        declarations: [UserImagesPage, TrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          RouterTestingModule.withRoutes([{ path: 'fiat-ramps/user-images', component: DummyComponent }]),
          HttpClientTestingModule,
          IonicModule,
          TranslateModule.forRoot(),
          ReactiveFormsModule,
        ],
        providers: [
          TrackClickDirective,
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: TrackService, useValue: trackServiceSpy}
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserImagesPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call registerUserImages on handleSubmit and valid form', async () => {
    fiatRampsServiceSpy.registerUserImages.and.returnValue(of({}));
    component.form.patchValue(formData.valid);
    await component.handleSubmit();
    fixture.detectChanges();
    expect(fiatRampsServiceSpy.registerUserImages).toHaveBeenCalledTimes(1);
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
