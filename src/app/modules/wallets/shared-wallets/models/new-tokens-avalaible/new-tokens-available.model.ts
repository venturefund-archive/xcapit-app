import { RemoteConfigService } from "src/app/shared/services/remote-config/remote-config.service";
import { NewToken } from "../../interfaces/new-token.interface";

export class NewTokensAvailable {
    constructor(private remoteConfig: RemoteConfigService) {}
    value(): NewToken[] {
      return this.remoteConfig.getObject('newTokensAvailable');
    }
}