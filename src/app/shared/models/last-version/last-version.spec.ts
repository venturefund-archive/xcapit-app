import { FakePlatformService } from '../../services/platform/fake/fake-platform.service';
import { FakeRemoteConfigService } from '../../services/remote-config/fake/fake-remote-config-service';
import { FakeAppVersion } from '../app-version/fake/fake-app-version';
import { LastVersion } from './last-version';

describe('LastVersion', () => {
  let lastVersion: LastVersion;

  beforeEach(async () => {
    lastVersion = new LastVersion(
      new FakeAppVersion(),
      new FakeRemoteConfigService({}, true),
      new FakePlatformService(true)
    );
  });

  it('new', () => {
    expect(lastVersion).toBeTruthy();
  });

  it('inReview when is not the last version', async () => {
    expect(await lastVersion.inReview()).toBeFalse();
  });

  it('inReview when no native', async () => {
    lastVersion = new LastVersion(
      new FakeAppVersion(),
      new FakeRemoteConfigService({}, true),
      new FakePlatformService(false)
    );
    expect(await lastVersion.inReview()).toBeFalse();
  });

  it('inReview when native and is the last version in review', async () => {
    lastVersion = new LastVersion(
      new FakeAppVersion(null, null, Promise.resolve(true)),
      new FakeRemoteConfigService({}, true),
      new FakePlatformService(true)
    );
    expect(await lastVersion.inReview()).toBeTrue();
  });
});
