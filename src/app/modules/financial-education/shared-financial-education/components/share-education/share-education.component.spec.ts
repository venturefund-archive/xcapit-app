import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ShareService } from 'src/app/shared/services/share/share.service';

import { ShareEducationComponent } from './share-education.component';
import { CachedAssetFactory } from '../../../../../shared/models/asset/cached-asset/factory/cached-asset-factory';
import { CachedAsset } from 'src/app/shared/models/asset/cached-asset/cached-asset';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { By } from '@angular/platform-browser';

describe('ShareEducationComponent', () => {
  let component: ShareEducationComponent;
  let fixture: ComponentFixture<ShareEducationComponent>;
  let shareServiceSpy: jasmine.SpyObj<ShareService>;
  let cachedAssetFactorySpy: jasmine.SpyObj<CachedAssetFactory>;
  let cachedAssetSpy: jasmine.SpyObj<CachedAsset>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;

  beforeEach(
    waitForAsync(() => {
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
        declarations: [ShareEducationComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ShareService, useValue: shareServiceSpy },
          { provide: CachedAssetFactory, useValue: cachedAssetFactorySpy },
          { provide: PlatformService, useValue: platformServiceSpy },
        ],
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
    expect(shareServiceSpy.share).toHaveBeenCalledOnceWith(
      {
        title: 'financial_education.shared.share_education.title',
        text: 'financial_education.shared.share_education.text https://play.google.com/store/apps/details?id=com.xcapit.app',
        url: 'cache/file.jpg',
        dialogTitle: 'financial_education.shared.share_education.dialogTitle',
      },
      ''
    );
  });

  it('should share image with iOS link when component is clicked', async () => {
    platformServiceSpy.platform.and.returnValue('ios');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.se')).nativeElement.click();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(shareServiceSpy.share).toHaveBeenCalledOnceWith(
      {
        title: 'financial_education.shared.share_education.title',
        text: 'financial_education.shared.share_education.text https://apps.apple.com/ar/app/xcapit/id1545648148',
        url: 'cache/file.jpg',
        dialogTitle: 'financial_education.shared.share_education.dialogTitle',
      },
      ''
    );
  });
});
