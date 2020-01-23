import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralsListPage } from './referrals-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ApiReferralsService } from '../shared-referrals/services/api-referrals/api-referrals.service';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ShareService } from 'src/app/shared/services/share/share.service';

describe('ReferralsListPage', () => {
  let component: ReferralsListPage;
  let fixture: ComponentFixture<ReferralsListPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<
    ReferralsListPage
  >;
  let ionInfiniteScrollMock: any;
  let apiReferralsServiceSpy: any;
  let apiUsuariosServiceSpy: any;
  let shareServiceSpy: any;
  let clipboardServiceSpy: any;
  const referralsTestData = {
    cursors: { previous: '', next: '' },
    links: { previous: '', next: '' },
    results: []
  };
  const user = {
    id: '',
    referral_id: 'test',
    profile: {}
  };
  beforeEach(async(() => {
    ionInfiniteScrollMock = {
      complete: () => true,
      disabled: true
    };
    apiReferralsServiceSpy = {
      getUserReferrals: () => of(referralsTestData)
    };
    apiUsuariosServiceSpy = {
      getUser: () => of(user)
    };
    clipboardServiceSpy = {
      write: () => Promise.resolve()
    };
    shareServiceSpy = {
      share: () => Promise.resolve()
    };
    TestBed.configureTestingModule({
      declarations: [ReferralsListPage, TrackClickDirective],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        TrackClickDirective,
        { provide: ApiReferralsService, useValue: apiReferralsServiceSpy },
        { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
        { provide: ClipboardService, useValue: clipboardServiceSpy },
        { provide: ShareService, useValue: shareServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralsListPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    apiReferralsServiceSpy = TestBed.get(ApiReferralsService);
    apiUsuariosServiceSpy = TestBed.get(ApiUsuariosService);
    clipboardServiceSpy = TestBed.get(ClipboardService);
    shareServiceSpy = TestBed.get(ShareService);
    component.infiniteScroll = ionInfiniteScrollMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when New Referral is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-fab-button',
      'New Referral'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
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

  it('should call clipboardService.write on copyReferralId', () => {
    const spy = spyOn(clipboardServiceSpy, 'write');
    spy.and.returnValue(Promise.resolve());
    component.copyReferralId();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call shareService.share on shareReferralId', () => {
    const spy = spyOn(shareServiceSpy, 'share');
    spy.and.returnValue(Promise.resolve());
    component.shareReferralId();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

});
