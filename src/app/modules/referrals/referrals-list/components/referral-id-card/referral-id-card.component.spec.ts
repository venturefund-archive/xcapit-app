import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReferralIdCardComponent } from './referral-id-card.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardService } from '../../../../../shared/services/clipboard/clipboard.service';
import { ShareService } from '../../../../../shared/services/share/share.service';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { TrackClickDirective } from '../../../../../shared/directives/track-click/track-click.directive';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReferralIdCardComponent', () => {
  let component: ReferralIdCardComponent;
  let fixture: ComponentFixture<ReferralIdCardComponent>;
  let shareServiceSpy: any;
  let clipboardServiceSpy: any;
  let toastServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ReferralIdCardComponent>;
  beforeEach(async(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', [
      'showToast'
      ,
    ]);
    shareServiceSpy = jasmine.createSpyObj('ShareService', ['share']);
    clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', ['write']);
    TestBed.configureTestingModule({
      declarations: [ReferralIdCardComponent, TrackClickDirective],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        TrackClickDirective,
        TranslateService,
        { provide: ClipboardService, useValue: clipboardServiceSpy },
        { provide: ShareService, useValue: shareServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReferralIdCardComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call clipboardService.write on copyReferralId', () => {
    component.copyReferralId();
    fixture.detectChanges();
    expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(1);
  });

  it('should call shareService.share on shareReferralId', () => {
    component.shareReferralId();
    fixture.detectChanges();
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

  it('should call trackEvent on trackService when Copy is clicked', () => {
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
