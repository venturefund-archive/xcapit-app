import { jwtOptionsFactory } from './jwt-options.factory';
import { AppStorageService } from '../../services/app-storage/app-storage.service';

describe('JwtOptionsFactory', () => {
  beforeEach(() => {});

  it('should return a TranslateHttpLoader instance', () => {
    const storageMock = new AppStorageService();
    const spy = spyOn(storageMock, 'get');
    spy.and.returnValue(Promise.resolve({}));
    const value = jwtOptionsFactory(storageMock);
    value.tokenGetter();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
