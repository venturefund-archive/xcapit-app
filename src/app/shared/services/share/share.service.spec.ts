import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShareService } from './share.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { ToastService } from '../toast/toast.service';
import { WriteOptions } from '@capacitor/clipboard';
import { ShareOptions } from '@capacitor/share';

describe('ShareService', () => {
  const data = {
    title: 'testitle',
    text: 'testext',
    url: 'testurl',
    dialogTitle: 'testdialogtitle',
  } as ShareOptions;

  const dataClipboard = {
    string: 'testext testurl',
    label: 'testitle',
    url: 'testurl',
  } as WriteOptions;

  let shareMock: any;
  let service: ShareService;
  let clipboardServiceMock: any;
  let clipboardService: any;
  let toastServiceMock: any;
  let toastService: any;
  beforeEach(async () => {
    shareMock = {
      share: () => Promise.resolve({}),
    };
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
    service.sharePlugin = shareMock;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not call clipboardService write on share success', () => {
    const spy = spyOn(service.sharePlugin, 'share').and.returnValue(Promise.resolve({}));
    spyOn(clipboardService, 'write').and.returnValue(Promise.resolve({}));
    spyOn(toastService, 'showInfoToast').and.returnValue(Promise.resolve());

    service.share(data, 'Copied');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call clipboardService write on share error', fakeAsync(() => {
    const spy = spyOn(service.sharePlugin, 'share').and.returnValue(Promise.reject({}));
    const spyClipboard = spyOn(clipboardService, 'write').and.returnValue(Promise.resolve({}));
    const spyToast = spyOn(toastService, 'showInfoToast').and.returnValue(Promise.resolve());
    service.share(data, 'Copied');
    tick();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyClipboard).toHaveBeenCalledTimes(1);
    expect(spyToast).toHaveBeenCalledTimes(1);
  }));

  it('should call clipboardService write on share error and not url data', fakeAsync(() => {
    const spy = spyOn(service.sharePlugin, 'share').and.returnValue(Promise.reject({}));
    const spyClipboard = spyOn(clipboardService, 'write').and.returnValue(Promise.resolve({}));
    const spyToast = spyOn(toastService, 'showInfoToast').and.returnValue(Promise.resolve());
    delete data.url;
    service.share(data, 'Copied');
    tick();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyClipboard).toHaveBeenCalledTimes(1);
    expect(spyToast).toHaveBeenCalledTimes(1);
  }));
});
