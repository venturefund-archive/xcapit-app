import { LendersDataRepo } from '../data-repo/lenders-data-repo';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { LendersInjectable } from './lenders.injectable';
import { FakeRemoteConfigService } from '../../../services/remote-config/fake/fake-remote-config-service';

describe('LendersInjectable', () => {
  it('new', () => {
    expect(new LendersInjectable(null, null)).toBeTruthy();
  });

  it('create', () => {
    expect(
      new LendersInjectable(null, null).create(
        new LendersDataRepo(new FakeRemoteConfigService()),
        new FakeTranslateService()
      )
    ).toBeTruthy();
  });
});
