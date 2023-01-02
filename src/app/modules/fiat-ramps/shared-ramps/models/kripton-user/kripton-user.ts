
import { KriptonStorageService } from '../../services/kripton-storage/kripton-storage.service';

export class KriptonUser {
  private readonly _accessTokenKey = 'access_token';
  private readonly _refreshTokenKey = 'refresh_token';
  private readonly _userStatusKey = 'user_status'
  constructor(private readonly _storage: KriptonStorageService) {}

  accessToken(): Promise<string> {
    return this._storage.get(this._accessTokenKey);
  }

  refreshToken(): Promise<string> {
    return this._storage.get(this._refreshTokenKey);
  }

  public async isLogged(): Promise<boolean> {
    return !!(await this.accessToken());
  }

  userStatus(): Promise<string> {
    return this._storage.get(this._userStatusKey);
  }
}
