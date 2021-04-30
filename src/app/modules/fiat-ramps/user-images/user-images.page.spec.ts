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
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';

const formData = {
  valid: {
    front_document: {
      type: 'front_document',
      image: 'imageb64',
    },
    back_document: {
      type: 'back_document',
      image: 'imageb64',
    },
    billing: {
      type: 'billing',
      image: 'imageb64',
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

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        registerUserImages: of({}),
      });

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

  it('should call registerUserImages on handleSubmit and valid form', async (done) => {
    fiatRampsServiceSpy.registerUserImages.and.returnValue(of({}));
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fiatRampsServiceSpy.registerUserImages).toHaveBeenCalledTimes(1);
    });
    done();
  });
});
