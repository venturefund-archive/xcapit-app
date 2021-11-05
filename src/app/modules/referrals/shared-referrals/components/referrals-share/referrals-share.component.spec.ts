import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReferralsShareComponent } from './referrals-share.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardService } from '../../../../../shared/services/clipboard/clipboard.service';
import { ShareService } from '../../../../../shared/services/share/share.service';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { By } from '@angular/platform-browser';

describe('ReferralsShareComponent', () => {
  let component: ReferralsShareComponent;
  let fixture: ComponentFixture<ReferralsShareComponent>;
  let shareServiceSpy: jasmine.SpyObj<ShareService>;
  let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ReferralsShareComponent>;
  beforeEach(
    waitForAsync(() => {
      shareServiceSpy = jasmine.createSpyObj('ShareService', {
        share: Promise.resolve(),
      });
      clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', {
        write: Promise.resolve(),
      });
      TestBed.configureTestingModule({
        declarations: [ReferralsShareComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ShareService, useValue: shareServiceSpy },
          { provide: ClipboardService, useValue: clipboardServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ReferralsShareComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call share when Share button clicked', async () => {
    component.link = 'test_link';
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const el = fixture.debugElement.query(By.css('ion-button[name="Share"]'));
    el.nativeElement.click();
    await fixture.whenStable();
    expect(shareServiceSpy.share).toHaveBeenCalledOnceWith({ url: 'test_link' }, '');
  });

  it('should call share when Copy button clicked', async () => {
    component.link = 'test_link';
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const el = fixture.debugElement.query(By.css('ion-button[name="Copy"]'));
    el.nativeElement.click();
    await fixture.whenStable();
    expect(clipboardServiceSpy.write).toHaveBeenCalledOnceWith({ string: 'test_link', url: 'test_link' });
  });

  it('should call trackEvent on trackService when Share button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Share');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Copy button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Copy');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
