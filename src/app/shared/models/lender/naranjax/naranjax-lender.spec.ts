import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { Lender } from '../lender.interface';
import { rawLender } from '../raw-lender.fixture';
import { NaranjaXLender } from './naranjax-lender';

describe('NaranjaXLender', () => {
  let lender: Lender;

  beforeEach(() => {
    lender = new NaranjaXLender(new FakeTranslateService());
  });

  it('new', () => {
    expect(lender).toBeTruthy();
  });

  it('firstStepUrl', () => {
    expect(lender.firstStepUrl()).toEqual(rawLender.firstStepUrl);
  });

  it('logo', () => {
    expect(lender.logo()).toEqual('assets/img/warranty/naranjax.svg');
  });

  it('url', () => {
    expect(lender.url()).toEqual('https://www.naranjax.com/');
  });

  it('json', () => {
    expect(lender.json()).toEqual(rawLender);
  });
});
