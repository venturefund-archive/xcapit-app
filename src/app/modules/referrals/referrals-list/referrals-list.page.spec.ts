import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralsListPage } from './referrals-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReferralsListPage', () => {
  let component: ReferralsListPage;
  let fixture: ComponentFixture<ReferralsListPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<
    ReferralsListPage
  >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralsListPage, TrackClickDirective],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()],
      providers: [TrackClickDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
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
});
