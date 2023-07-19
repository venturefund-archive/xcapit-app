import { rawLender } from '../../lender/raw-lender.fixture';
import { LendersDataRepo } from './lenders-data-repo';
import { FakeRemoteConfigService } from '../../../services/remote-config/fake/fake-remote-config-service';

describe('LendersDataRepo', () => {
  let lendersDataRepo: LendersDataRepo;

  beforeEach(() => {
    lendersDataRepo = new LendersDataRepo(new FakeRemoteConfigService([rawLender, rawLender]));
  });

  it('new', () => {
    expect(lendersDataRepo).toBeTruthy();
  });

  it('oneByName', () => {
    expect(lendersDataRepo.oneByName('naranjax')).toEqual(rawLender);
  });

  it('oneByName with non exists lender', () => {
    expect(lendersDataRepo.oneByName('nonExists')).toBeUndefined();
  });
});
