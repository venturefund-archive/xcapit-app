import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { ShareReferralCardComponent } from './share-referral-card.component';

describe('ShareReferralCardComponent', () => {
  let component: ShareReferralCardComponent;
  let fixture: ComponentFixture<ShareReferralCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<
    ShareReferralCardComponent
  >;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareReferralCardComponent, TrackClickDirective],
      imports: [HttpClientTestingModule, IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        TrackClickDirective,
        TranslateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShareReferralCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ShareReferralCardComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Share is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Share Referral'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
