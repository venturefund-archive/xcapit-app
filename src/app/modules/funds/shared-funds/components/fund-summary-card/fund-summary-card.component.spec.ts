import { CurrencyFormatPipe } from './../../pipes/currency-format/currency-format.pipe';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundSummaryCardComponent } from './fund-summary-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { ApiSubscriptionsService } from 'src/app/modules/subscriptions/shared-subscriptions/services/api-subscriptions/api-subscriptions.service';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { FundSummaryInterface } from './fund-summary.interface';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DecimalPipe } from '@angular/common';
const testData = { link: 'https://test.link' };
const testSummary: FundSummaryInterface = {
  fund: { nombre_bot: 'Test', currency: 'BTC' },
  balance: {
    start_balance: '',
    end_balance: ''
  }
};
describe('FundSummaryCardComponent', () => {
  let component: FundSummaryCardComponent;
  let fixture: ComponentFixture<FundSummaryCardComponent>;
  let apiSubscriptionsSpy: any;
  let shareServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundSummaryCardComponent>;

  beforeEach(async(() => {
    apiSubscriptionsSpy = jasmine.createSpyObj('ApiSubscriptionsService', [
      'getSubscriptionLink'
    ]);
    shareServiceSpy = jasmine.createSpyObj('ShareService', ['share']);
    TestBed.configureTestingModule({
      declarations: [FundSummaryCardComponent, TrackClickDirective, CurrencyFormatPipe, DecimalPipe],
      imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        CurrencyFormatPipe,
        DecimalPipe,
        { provide: ApiSubscriptionsService, useValue: apiSubscriptionsSpy },
        { provide: ShareService, useValue: shareServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FundSummaryCardComponent);
    component = fixture.componentInstance;
    component.summary = testSummary;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call shareService.share on shareSubscriptionLink', () => {
    apiSubscriptionsSpy.getSubscriptionLink.and.returnValue(of(testData));
    shareServiceSpy.share.and.returnValue(Promise.resolve());
    component.shareSubscriptionLink();
    expect(shareServiceSpy.share).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Share is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Share'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
