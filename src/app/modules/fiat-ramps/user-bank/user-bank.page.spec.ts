import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { UserBankPage } from './user-bank.page';
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
    cuit: '20333333339',
    cbu_cvu: '1234567890123456789012',
    banco: 'Banco Nación',
  },
  invalid: {
    cuit: '',
    cbu_cvu: '',
    banco: '',
  },
};

describe('UserBankPage', () => {
  let component: UserBankPage;
  let fixture: ComponentFixture<UserBankPage>;
  let fiatRampsServiceSpy: any;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UserBankPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  
  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        registerUserBank: of({}),
      });
      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy',{
        trackEvent: Promise.resolve(true),
      })

      TestBed.configureTestingModule({
        declarations: [UserBankPage, TrackClickDirective, DummyComponent],
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
          { provide: TrackService, useValue: trackServiceSpy }
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBankPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call registerUserBank on handleSubmit and valid form', async () => {
    fiatRampsServiceSpy.registerUserBank.and.returnValue(of({}));
    component.form.patchValue(formData.valid);
    await component.handleSubmit();
    fixture.detectChanges();
    expect(fiatRampsServiceSpy.registerUserBank).toHaveBeenCalledTimes(1);
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
