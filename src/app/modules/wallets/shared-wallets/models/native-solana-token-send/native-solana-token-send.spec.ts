import { Send } from '../../interfaces/send.interface';

export class NativeSolanaTokenSend implements Send {
  send(): Promise<string | TransactionResponse> {
    return Promise.resolve(undefined);
  }

  get tokenDecimals(): number {
    return 0;
  }

}

fdescribe('NativeSolanaTokenSend', () => {
  it('new', () => {
    expect(new NativeSolanaTokenSend()).toBeTruthy();
  });

  it('')
});
