import { Lender } from '../lender.interface';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { rawNullLender } from '../raw-lender.fixture';
import { NullLender } from './null-lender';

describe('NullLender', () => {
  let lender: Lender;

  beforeEach(() => {
    lender = new NullLender(new FakeTranslateService());
  });

  it('new', () => {
    expect(lender).toBeTruthy();
  });

  it('json', () => {
    expect(lender.json()).toEqual(rawNullLender);
  });

  it('firstStepUrl', () => {
    expect(lender.firstStepUrl()).toEqual(rawNullLender.firstStepUrl);
  });

  it('logo', () => {
    expect(lender.logo()).toBeNull();
  });

  it('url', () => {
    expect(lender.url()).toBeNull();
  });
});
