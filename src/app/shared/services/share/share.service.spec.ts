import { TestBed} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShareService } from './share.service';
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

  beforeEach(async () => {
    shareSpy = jasmine.createSpyObj('Share', {
      share: Promise.resolve({}),
      canShare: Promise.resolve({ value: true }),
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ShareService);
    service.sharePlugin = shareSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should share', () => {
    service.share(data);
    expect(shareSpy.share).toHaveBeenCalledTimes(1);
  });

  it('should check if share is available', async () => {
    expect(await service.canShare()).toEqual(true);
  });
});
