import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
  let service: ClipboardService;
  beforeEach(() => {
    service = new ClipboardService();
    service.clipboard = jasmine.createSpyObj('Clipboard', {
      write: Promise.resolve(),
      read: Promise.resolve({ type: 'test', value: 'testResult' }),
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call capacitor write on write', async () => {
    await service.write({});
    expect(service.clipboard.write).toHaveBeenCalledOnceWith({});
  });

  it('should call capacitor read on read', async () => {
    const result = await service.read();
    expect(result.value).toBe('testResult');
  });
});
