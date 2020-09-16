import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Plugins, ShareOptions, SharePluginWeb } from '@capacitor/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShareService } from './share.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { ToastService } from '../toast/toast.service';

describe('ShareService', () => {
  const data = {
    title: 'testitle',
    text: 'testext',
    url: 'testurl',
    dialogTitle: 'testdialogtitle'
  } as ShareOptions;
  let shareMock: any;
  let service: ShareService;
  // let sharePlugin: any;
  let clipboardServiceMock: any;
  let clipboardService: any;
  let toastServiceMock: any;
  let toastService: any;
  // let sharePluginWebMock: any;
  // let sharePluginWebService: any;
  beforeEach(async () => {
    shareMock = {
      share: () => Promise.resolve({})
    };
    clipboardServiceMock = {
      write: () => Promise.resolve({})
    };
    toastServiceMock = {
      showToast: () => Promise.resolve()
    };
    // sharePluginWebMock = {
    //   config: { name: 'Share', platforms: Array(1) },
    //   loaded: true,
    //   listeners: {},
    //   windowListeners: {}
    // };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Plugins.Share, useValue: shareMock },
        { provide: ClipboardService, useValue: clipboardServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        // { provide: SharePluginWeb, useValue: sharePluginWebMock }
      ]
    });
  });

  beforeEach(() => {
    // sharePlugin = TestBed.inject(Plugins.Share);
    clipboardService = TestBed.inject(ClipboardService);
    toastService = TestBed.inject(ToastService);
    // sharePluginWebService = TestBed.inject(SharePluginWeb);
    service = TestBed.inject(ShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // xit('should not call clipboardService write on share success', () => {
  //   // TODO: Ver como mockear Plugins.Share
  //   const spy = spyOn(sharePlugin, 'share').and.returnValue(
  //     Promise.resolve({})
  //   );
  //   const spyClipboard = spyOn(clipboardService, 'write').and.returnValue(
  //     Promise.resolve({})
  //   );
  //   const spyToast = spyOn(toastService, 'showToast').and.returnValue(
  //     Promise.resolve()
  //   );
  //
  //   service.share(data, 'Copied');
  //   expect(spy).toHaveBeenCalledTimes(1);
  // });

  xit('should call clipboardService write on share error', async () => {
    // TODO: Ver como mockear Plugins.Share
  });
});
