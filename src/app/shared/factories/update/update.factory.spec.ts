import { updateServiceFactory } from './update.factory';
import { UpdateAppService } from '../../services/update-app/update-app.service';
import { UpdatePWAService } from '../../services/update-pwa/update-pwa.service';

describe('UpdateFactory', () => {
  beforeEach(() => {});

  it('should create UpdateAppService instance when native platform', () => {
    const result = updateServiceFactory({ isNative: () => true }, {}, {});
    expect(result).toBeInstanceOf(UpdateAppService);
  });

  it('should create UpdateAppService instance when not native platform', () => {
    const result = updateServiceFactory({ isNative: () => false }, {}, {});
    expect(result).toBeInstanceOf(UpdatePWAService);
  });
});
