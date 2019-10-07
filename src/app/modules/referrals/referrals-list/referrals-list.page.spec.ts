import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralsListPage } from './referrals-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ApiReferralsService } from '../shared-referrals/services/api-referrals/api-referrals.service';

describe('ReferralsListPage', () => {
  let component: ReferralsListPage;
  let fixture: ComponentFixture<ReferralsListPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<
    ReferralsListPage
  >;
  let ionInfiniteScrollMock: any;
  let apiReferralsServiceSpy: any;
  const referralsTestData = {
    cursors: { previous: '', next: '' },
    links: { previous: '', next: '' },
    results: []
  };
  beforeEach(async(() => {
    ionInfiniteScrollMock = {
      complete: () => true,
      disabled: true
    };
    apiReferralsServiceSpy = {
      getUserReferrals: () => of(referralsTestData)
    };
    TestBed.configureTestingModule({
      declarations: [ReferralsListPage, TrackClickDirective],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        TrackClickDirective,
        { provide: ApiReferralsService, useValue: apiReferralsServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralsListPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    apiReferralsServiceSpy = TestBed.get(ApiReferralsService);
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
});
