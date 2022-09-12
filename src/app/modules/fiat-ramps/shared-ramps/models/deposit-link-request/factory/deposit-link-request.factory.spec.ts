import DepositLinkRequestFactory from './deposit-link-request.factory';
import { EnvService } from '../../../../../../shared/services/env/env.service';
import DepositLinkRequest from '../deposit-link-request';
import { DirectaDepositCreationData } from '../../../interfaces/directa-deposit-creation-data.interface';

describe('DepositLinkRequestFactory', () => {
  let depositLinkRequestFactory: DepositLinkRequestFactory;
  let depositCreationDataSpy: jasmine.SpyObj<DirectaDepositCreationData>;
  let envServiceSpy: jasmine.SpyObj<EnvService>;

  beforeEach(() => {
    depositLinkRequestFactory = new DepositLinkRequestFactory(null, envServiceSpy);
  });

  it('create', () => {
    expect(depositLinkRequestFactory).toBeTruthy();
  });

  it('new', () => {
    expect(depositLinkRequestFactory.new(depositCreationDataSpy)).toBeInstanceOf(DepositLinkRequest);
  });
});
