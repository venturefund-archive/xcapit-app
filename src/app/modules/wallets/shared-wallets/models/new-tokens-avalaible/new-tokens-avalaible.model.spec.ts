import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { NewToken } from '../../interfaces/new-token.interface';
import { NewTokensAvailable } from './new-tokens-available.model';

const NEW_TOKEN: NewToken[] = [
    {
      name: "SOL",
      network: "SOLANA",
      icon: "assets/img/coins/SOL.svg",
    },
  ];

describe('NewTokensAvailable', () => {
    let newTokensAvailable: NewTokensAvailable;
    let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
    beforeEach(() => {
      remoteConfigSpy = jasmine.createSpyObj('RemoteConfigSpy', {
        getObject: NEW_TOKEN,
      });
    });
  
    it('should create', () => {
        newTokensAvailable = new NewTokensAvailable(remoteConfigSpy);
      expect(newTokensAvailable).toBeTruthy();
    });
  
    it('should return new token', () => {
        newTokensAvailable = new NewTokensAvailable(remoteConfigSpy);
      expect(newTokensAvailable.value()).toEqual(NEW_TOKEN);
    });
});