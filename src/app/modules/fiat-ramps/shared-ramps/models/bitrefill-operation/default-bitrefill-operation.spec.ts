import { BlockchainRepo } from "src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo";
import { DefaultBlockchains } from "src/app/modules/swaps/shared-swaps/models/blockchains/blockchains";
import { rawBlockchainsData } from "src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data";
import { rawETHData, rawTokensData } from "src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data";
import { TokenRepo } from "src/app/modules/swaps/shared-swaps/models/token-repo/token-repo";
import { DefaultTokens } from "src/app/modules/swaps/shared-swaps/models/tokens/tokens";
import { rawNativeEvent, rawNonNativeEvent } from "../../fixtures/raw-bitrefill-operation-data";
import { DefaultBitrefillOperation } from "./default-bitrefill-operation";

describe('DefaultBitrefillOperation', () => {
  let operation: DefaultBitrefillOperation;
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));
  const tokens = new DefaultTokens(new TokenRepo(rawTokensData));
  
  beforeEach(() => {
    operation = new DefaultBitrefillOperation(rawNativeEvent, tokens, blockchains);
  });

  it('new', () => {
    expect(operation).toBeTruthy();
  });

  it('address', () => {
    expect(operation.address()).toEqual('0xD148C6735e1777BE439519B32A1a6Ef9c8853944');
  });

  it('paymentMethod', () => {
    expect(operation.paymentMethod()).toEqual('ethereum');
  });

  it('amount', async () => {
    expect((await operation.amount()).value()).toEqual(0.2);
  });

  it('token', async () => {
    expect((await operation.token()).symbol()).toEqual(rawETHData.value);
  });

  it('non native address', () => {
    const operation = new DefaultBitrefillOperation(rawNonNativeEvent, tokens, blockchains);

    expect(operation.address()).toEqual('0xD148C6735e1777BE439519B32A1a6Ef9c8853945');
  });

  it('non native token', async () => {
    const operation = new DefaultBitrefillOperation(rawNonNativeEvent, tokens, blockchains);

    expect((await operation.token()).address()).toEqual('0x2791bca1f2de4661ed88a30c99a7a9449aa84174');
  });

  it('non native amount', async () => {
    const operation = new DefaultBitrefillOperation(rawNonNativeEvent, tokens, blockchains);

    expect((await operation.amount()).value()).toEqual(0.58);
  });
});
