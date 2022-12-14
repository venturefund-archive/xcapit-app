import { SwapError } from './swap-error';

describe('SwapError', () => {
  let swapError: SwapError;
  let error: any;

  beforeEach(() => {
    error = {
      url: 'www.1inch.com',
    };
    swapError = new SwapError(error);
  });

  it('new', () => {
    expect(swapError).toBeTruthy();
  });

  it('type 1inch', () => {
    expect(swapError.type()).toEqual('swap_not_ok');
  });

  it('type blockchain', () => {
    error = { url: 'aBlockchain error' };
    swapError = new SwapError(error);
    expect(swapError.type()).toEqual('swap_not_ok_blockchain');
  });
});
