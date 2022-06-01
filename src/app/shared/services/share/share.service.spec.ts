import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShareService } from './share.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { ToastService } from '../toast/toast.service';
import { ShareOptions, SharePlugin } from '@capacitor/share';

describe('ShareService', () => {
  const data = {
    title: 'testitle',
    text: 'testext',
    url: 'testurl',
    dialogTitle: 'testdialogtitle',
  } as ShareOptions;

  let shareSpy: jasmine.SpyObj<SharePlugin>;
  let service: ShareService;
  let clipboardServiceMock: any;
  let clipboardService: any;
  let toastServiceMock: any;
  let toastService: any;
  beforeEach(async () => {
    shareSpy = jasmine.createSpyObj('Share', {
      share: Promise.resolve({}),
      canShare: Promise.resolve({ value: true }),
    });
    clipboardServiceMock = {
      write: () => Promise.resolve({}),
    };
    toastServiceMock = {
      showInfoToast: () => Promise.resolve(),
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClipboardService, useValue: clipboardServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    });
  });

  beforeEach(() => {
    clipboardService = TestBed.inject(ClipboardService);
    toastService = TestBed.inject(ToastService);
    service = TestBed.inject(ShareService);
    service.sharePlugin = shareSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not call clipboardService write on share success', () => {
    spyOn(clipboardService, 'write').and.returnValue(Promise.resolve({}));
    spyOn(toastService, 'showInfoToast').and.returnValue(Promise.resolve());

    service.share(data, 'Copied');
    expect(shareSpy.share).toHaveBeenCalledTimes(1);
  });

  it('should call clipboardService write on share error', fakeAsync(() => {
    shareSpy.share.and.returnValue(Promise.reject({}));
    const spyClipboard = spyOn(clipboardService, 'write').and.returnValue(Promise.resolve({}));
    const spyToast = spyOn(toastService, 'showInfoToast').and.returnValue(Promise.resolve());
    service.share(data, 'Copied');
    tick();
    expect(shareSpy.share).toHaveBeenCalledTimes(1);
    expect(spyClipboard).toHaveBeenCalledTimes(1);
    expect(spyToast).toHaveBeenCalledTimes(1);
  }));

  it('should call clipboardService write on share error and not url data', fakeAsync(() => {
    shareSpy.share.and.returnValue(Promise.reject({}));
    const spyClipboard = spyOn(clipboardService, 'write').and.returnValue(Promise.resolve({}));
    const spyToast = spyOn(toastService, 'showInfoToast').and.returnValue(Promise.resolve());
    delete data.url;
    service.share(data, 'Copied');
    tick();
    expect(shareSpy.share).toHaveBeenCalledTimes(1);
    expect(spyClipboard).toHaveBeenCalledTimes(1);
    expect(spyToast).toHaveBeenCalledTimes(1);
  }));

  it('should check if share is available', async () => {
    expect(await service.canShare()).toEqual(true);
  });
});
