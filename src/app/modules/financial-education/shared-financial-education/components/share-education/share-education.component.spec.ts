import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ShareService } from 'src/app/shared/services/share/share.service';

import { ShareEducationComponent } from './share-education.component';
import { CachedAssetFactory } from '../../../../../shared/models/asset/cached-asset/factory/cached-asset-factory';
import { CachedAsset } from 'src/app/shared/models/asset/cached-asset/cached-asset';
import { DefaultPlatformService } from 'src/app/shared/services/platform/default/default-platform.service';
import { By } from '@angular/platform-browser';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

describe('ShareEducationComponent', () => {
  let component: ShareEducationComponent;
  let fixture: ComponentFixture<ShareEducationComponent>;
  let shareServiceSpy: jasmine.SpyObj<ShareService>;
  let cachedAssetFactorySpy: jasmine.SpyObj<CachedAssetFactory>;
  let cachedAssetSpy: jasmine.SpyObj<CachedAsset>;
  let platformServiceSpy: jasmine.SpyObj<DefaultPlatformService>;
  let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(
    waitForAsync(() => {
      toastServiceSpy = jasmine.createSpyObj('ToastServiceSpy', {
        showInfoToast: Promise.resolve(),
      });

      clipboardServiceSpy = jasmine.createSpyObj('ClipboardServiceSpy', {
        write: Promise.resolve(),
      });

      shareServiceSpy = jasmine.createSpyObj('ShareServiceSpy', {
        canShare: Promise.resolve(true),
        share: Promise.resolve(),
      });

      cachedAssetSpy = jasmine.createSpyObj('CachedAsset', {
        value: { uri: 'cache/file.jpg' },
      });

      cachedAssetFactorySpy = jasmine.createSpyObj('CachedAssetFactory', {
        new: cachedAssetSpy,
      });

      platformServiceSpy = jasmine.createSpyObj('PlatformService', {
        platform: 'android',
      });

      TestBed.configureTestingModule({
        declarations: [ShareEducationComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ShareService, useValue: shareServiceSpy },
          { provide: CachedAssetFactory, useValue: cachedAssetFactorySpy },
          { provide: DefaultPlatformService, useValue: platformServiceSpy },
          { provide: ClipboardService, useValue: clipboardServiceSpy },
          { provide: ToastService, useValue: toastServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ShareEducationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if share is available on init', () => {
    expect(component.canShare).toBeTrue();
  });

  it('should share image with android link when component is clicked', async () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.se')).nativeElement.click();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(shareServiceSpy.share).toHaveBeenCalledOnceWith({
      title: 'financial_education.shared.share_education.title',
      text: 'financial_education.shared.share_education.text https://play.google.com/store/apps/details?id=com.xcapit.app',
      url: 'cache/file.jpg',
      dialogTitle: 'financial_education.shared.share_education.dialogTitle',
    });
  });

  it('should copy on clipboard and show toast when share fail', async () => {
    shareServiceSpy.share.and.rejectWith({ message: '' });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.se')).nativeElement.click();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(clipboardServiceSpy.write).toHaveBeenCalledOnceWith({
      string:
        'financial_education.shared.share_education.text https://play.google.com/store/apps/details?id=com.xcapit.app',
    });
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledOnceWith({
      message: 'financial_education.shared.share_education.share_error',
    });
  });

  it('should not copy on clipboard when user cancels sharing', async () => {
    shareServiceSpy.share.and.rejectWith({ message: 'Error: Share canceled' });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.se')).nativeElement.click();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(0);
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledTimes(0);
  });

  it('should share image with iOS link when component is clicked', async () => {
    platformServiceSpy.platform.and.returnValue('ios');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.se')).nativeElement.click();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(shareServiceSpy.share).toHaveBeenCalledOnceWith({
      title: 'financial_education.shared.share_education.title',
      text: 'financial_education.shared.share_education.text https://apps.apple.com/ar/app/xcapit/id1545648148',
      url: 'cache/file.jpg',
      dialogTitle: 'financial_education.shared.share_education.dialogTitle',
    });
  });
});
