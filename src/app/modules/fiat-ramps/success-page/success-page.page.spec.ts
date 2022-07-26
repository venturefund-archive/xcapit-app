import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SuccessPagePage } from './success-page.page';
import { TranslateModule } from '@ngx-translate/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { ActivatedRoute } from '@angular/router';
import { FakeActivatedRoute } from '../../../../testing/fakes/activated-route.fake.spec';

describe('SuccessPagePage', () => {
  let component: SuccessPagePage;
  let fixture: ComponentFixture<SuccessPagePage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(
    waitForAsync(() => {
      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
        trackEvent: Promise.resolve(true),
      });
      activatedRouteSpy = new FakeActivatedRoute({ operationId: 6 }).createSpy();

      TestBed.configureTestingModule({
        declarations: [SuccessPagePage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [IonicModule, TranslateModule.forRoot()],
        providers: [
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data on init', () => {
    const successDataCopy = { ...SUCCESS_TYPES.success_fiat_ramps };
    const validSuccessData = Object.assign(successDataCopy, {
      urlPrimaryAction: '/fiat-ramps/operation-detail/provider/1/operation/6',
    });
    component.ionViewWillEnter();
    expect(component.data).toEqual(validSuccessData);
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
