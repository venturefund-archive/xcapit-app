import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Plugins } from '@capacitor/core';
const { Share } = Plugins;
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShareService } from './share.service';

describe('ShareService', () => {
  const data = {
    title: 'testitle',
    text: 'testext',
    url: 'testurl',
    dialogTitle: 'testdialogtitle'
  };
  let shareMock: any;

  beforeEach(async () => {
    shareMock = {
        share: () => Promise.resolve({})
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{provide: Share, useValue: shareMock }]
    });
  });

  beforeEach(() => {
    shareMock = TestBed.get(Share);
  });

  it('should be created', () => {
    const service: ShareService = TestBed.get(ShareService);
    expect(service).toBeTruthy();
  });

  xit('should not call clipboardService write on share success', () => {
  // TODO: Ver como mockear Plugins.Share
    // const spy = spyOn(shareMock, 'share').and.returnValue(Promise.resolve({}));
    // const service: ShareService = TestBed.get(ShareService);
    // service.share(data);
    // expect(spy).toHaveBeenCalledTimes(1);
  });

  xit('should call clipboardService write on share error', async () => {
  // TODO: Ver como mockear Plugins.Share
  });
});
