import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { ShareReferralCardComponent } from './share-referral-card.component';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

describe('ShareReferralCardComponent', () => {
  let component: ShareReferralCardComponent;
  let fixture: ComponentFixture<ShareReferralCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ShareReferralCardComponent>;
  let shareServiceSpy: any;
  let clipboardServiceSpy: any;

  beforeEach(
    waitForAsync(() => {
      shareServiceSpy = jasmine.createSpyObj('ShareService', ['share']);
      clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', ['write']);
      clipboardServiceSpy.write.and.returnValue(Promise.resolve());
      TestBed.configureTestingModule({
        declarations: [ShareReferralCardComponent, FakeTrackClickDirective],
        imports: [HttpClientTestingModule, IonicModule, TranslateModule.forRoot()],
        providers: [TranslateService, { provide: ShareService, useValue: shareServiceSpy }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareReferralCardComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call shareService.share on shareReferralLink', () => {
    component.shareReferralLink();
    fixture.detectChanges();
    expect(shareServiceSpy.share).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Share is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Share Referral');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
