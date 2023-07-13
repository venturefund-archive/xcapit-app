import { DefaultLender } from '../../lender/default/default-lender';
import { LendersDataRepo } from '../data-repo/lenders-data-repo';
import { rawLender } from '../../lender/raw-lender.fixture';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { Lenders } from '../lenders.interface';
import { DefaultLenders } from './default-lenders';
import { FakeRemoteConfigService } from '../../../services/remote-config/fake/fake-remote-config-service';
import { NullLenderX } from '../../lender/null/null-lender-x';

describe('DefaultLenders', () => {
  let lenders: Lenders;
  let fakeTranslateService: FakeTranslateService;

  beforeEach(() => {
    fakeTranslateService = new FakeTranslateService();
    lenders = new DefaultLenders(
      new LendersDataRepo(new FakeRemoteConfigService([rawLender, rawLender])),
      fakeTranslateService
    );
  });

  it('new', () => {
    expect(lenders).toBeTruthy();
  });

  it('oneByName', () => {
    expect(lenders.oneByName('naranjax')).toEqual(new DefaultLender(rawLender, fakeTranslateService));
  });

  it('oneByName when null lender', () => {
    expect(lenders.oneByName('nonExist')).toEqual(new NullLenderX());
  });
});
