import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { ApiReferralsService } from '../shared-referrals/services/api-referrals/api-referrals.service';
import { ReferralsListPage } from './referrals-list.page';

describe('ReferralsListPage', () => {
  let component: ReferralsListPage;
  let fixture: ComponentFixture<ReferralsListPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ReferralsListPage>;
  let ionInfiniteScrollMock: any;
  let apiReferralsServiceSpy: any;
  let apiUsuariosServiceSpy: any;
  let navControllerSpy: any;
  const referralsTestData = {
    cursors: { previous: '', next: '' },
    links: { previous: '', next: '' },
    results: [],
  };
  const user = {
    id: '',
    referral_id: 'test',
    profile: {},
  };

  beforeEach(async(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    ionInfiniteScrollMock = {
      complete: () => true,
      disabled: true,
    };
    apiReferralsServiceSpy = {
      getUserReferrals: () => of(referralsTestData),
    };
    apiUsuariosServiceSpy = {
      getUser: () => of(user),
    };
    TestBed.configureTestingModule({
      declarations: [ReferralsListPage, TrackClickDirective],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        TrackClickDirective,
        TranslateService,
        { provide: ApiReferralsService, useValue: apiReferralsServiceSpy },
        { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralsListPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    apiReferralsServiceSpy = TestBed.inject(ApiReferralsService);
    apiUsuariosServiceSpy = TestBed.inject(ApiUsuariosService);
    component.infiniteScroll = ionInfiniteScrollMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showAlert when Go To Help Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Go To Help'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(component, 'showAlert');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getUserReferrals on ionViewDidEnter', () => {
    const getUserReferralsSpy = spyOn(component, 'getUserReferrals');
    component.ionViewDidEnter();
    fixture.detectChanges();
    expect(getUserReferralsSpy).toHaveBeenCalledTimes(1);
  });

  it('should call apiReferrals.getUserReferrals on getUserReferrals', () => {
    const spy = spyOn(apiReferralsServiceSpy, 'getUserReferrals');
    spy.and.returnValue(of(referralsTestData));
    component.getUserReferrals();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call apiUsuarios.getUser on getReferralId', () => {
    const spy = spyOn(apiUsuariosServiceSpy, 'getUser');
    spy.and.returnValue(of(user));
    component.getReferralId();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.referralId).toBe('test');
  });
});
