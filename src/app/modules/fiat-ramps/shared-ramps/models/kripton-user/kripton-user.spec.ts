import { KriptonUser } from './kripton-user';
import { KriptonStorageService } from '../../services/kripton-storage/kripton-storage.service';

describe('KriptonUser', () => {
  let kriptonUser: KriptonUser;
  let storageSpy: jasmine.SpyObj<KriptonStorageService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('KriptonStorageService', {
      get: Promise.resolve(),
    });
    storageSpy.get.withArgs('access_token').and.resolveTo('testAccessToken');
    storageSpy.get.withArgs('refresh_token').and.resolveTo('testRefreshToken');
    storageSpy.get.withArgs('user_status').and.resolveTo('testUserStatus');
    kriptonUser = new KriptonUser(storageSpy);
  });

  it('new', () => {
    expect(true).toBeTruthy();
  });

  it('accessToken', async () => {
    expect(await kriptonUser.accessToken()).toEqual('testAccessToken');
  });

  it('refreshToken', async () => {
    expect(await kriptonUser.refreshToken()).toEqual('testRefreshToken');
  });

  it('isLogged', async () => {
    expect(await kriptonUser.isLogged()).toBeTrue();
  });

  it('userStatus', async () => {
    expect(await kriptonUser.userStatus()).toEqual('testUserStatus');
  });
});
