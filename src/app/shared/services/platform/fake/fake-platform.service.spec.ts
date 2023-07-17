import { FakePlatformService } from './fake-platform.service';


describe('FakePlatformService', () => {
  let fakePlatformService: FakePlatformService;

  beforeEach(() => {
    fakePlatformService = new FakePlatformService(true);
  });

  it('new', () => {
    expect(fakePlatformService).toBeTruthy();
  });

  it('isNative', () => {
    expect(fakePlatformService.isNative()).toBeTrue();
  });
});
