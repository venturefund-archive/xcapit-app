import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
  let service: ClipboardService;
  beforeEach(() => {
    service = new ClipboardService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call capacitor write on write', async () => {
    const spy = spyOn(service.clipboard, 'write').and.resolveTo();
    await service.write({});
    expect(spy).toHaveBeenCalledWith({});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call capacitor read on read', async () => {
    const spy = spyOn(service.clipboard, 'read').and.resolveTo({ type: 'test', value: 'testResult' });
    const result = await service.read();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result.value).toBe('testResult');
  });
});
