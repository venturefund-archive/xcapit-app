import { BrowserService } from './browser.service';

describe('BrowserService', () => {
  let service: BrowserService;

  beforeEach(() => {
    service = new BrowserService();
    service.browser = jasmine.createSpyObj('Browser', { open: Promise.resolve() });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call open in browser with default options and custom options', async () => {
    await service.open({ url: 'test' });
    expect(service.browser.open).toHaveBeenCalledOnceWith({ url: 'test', toolbarColor: '#1c2d5e' });
  });

  it('should call open in browser with overriding default options', async () => {
    await service.open({ url: 'test', toolbarColor: 'red' });
    expect(service.browser.open).toHaveBeenCalledOnceWith({ url: 'test', toolbarColor: 'red' });
  });
});
