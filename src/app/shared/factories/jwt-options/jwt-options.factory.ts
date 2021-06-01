import { AppStorageService } from '../../services/app-storage/app-storage.service';
import { AUTH } from '../../../config/app-constants.config';
import { environment } from '../../../../environments/environment';

export function jwtOptionsFactory(storage: AppStorageService) {
  return {
    tokenGetter: () => storage.get(AUTH.storageKey),
    allowedDomains: environment.whitelistedDomains,
  };
}
