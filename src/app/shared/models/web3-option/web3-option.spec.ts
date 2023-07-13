import { FakeTranslateService } from '../translate-service/fake/fake-translate-service';
import { Web3Option } from './web3-option';


describe('Web3Option', () => {
  let web3Option: Web3Option;

  beforeEach(() => {
    web3Option = new Web3Option(new FakeTranslateService());
  });

  it('new', () => {
    expect(web3Option).toBeTruthy();
  });

  it('json', () => {
    expect(web3Option.json()).toBeTruthy();
  });
});
