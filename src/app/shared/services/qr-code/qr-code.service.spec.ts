import { QRCodeService } from './qr-code.service';

describe('QRCodeService', () => {
  let service: QRCodeService;

  beforeEach(() => {
    service = new QRCodeService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate qr from text', async () => {
    const spy = spyOn(service.qrCode, 'toDataURL').and.returnValue('test_qr');
    const result = await service.generateQRFromText('some text');

    expect(result).toBe('test_qr');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('some text');
  });
});
