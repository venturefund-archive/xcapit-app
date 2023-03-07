import { rawETHData, rawTokensData } from "src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data";
import { TokenRepo } from "src/app/modules/swaps/shared-swaps/models/token-repo/token-repo";
import { DefaultTokens } from "src/app/modules/swaps/shared-swaps/models/tokens/tokens";
import {  rawNativeEventInvoice, rawNonNativeEventInvoice } from "../../fixtures/raw-bitrefill-operation-data";
import { DefaultBitrefillOperation } from "./default-bitrefill-operation";

describe('DefaultBitrefillOperation', () => {
  let operation: DefaultBitrefillOperation;
  const tokens = new DefaultTokens(new TokenRepo(rawTokensData));
  
  beforeEach(() => {
    operation = new DefaultBitrefillOperation(rawNativeEventInvoice, tokens);
  });

  it('new', () => {
    expect(operation).toBeTruthy();
  });

  it('address', () => {
    expect(operation.address()).toEqual('0x58A7311cB3ce28DF2Eb5304128F7038e90F636d4');
  });

  it('paymentMethod', () => {
    expect(operation.paymentMethod()).toEqual('ethereum');
  });

  it('amount', async () => {
    expect(operation.amount()).toEqual(0.025737);
  });

  it('token', async () => {
    expect((await operation.token()).symbol()).toEqual(rawETHData.value);
  });

  it('non native address', () => {
    const operation = new DefaultBitrefillOperation(rawNonNativeEventInvoice, tokens);

    expect(operation.address()).toEqual('0x2FcA4930b3B59338bc57b9196eEae196e6A4Da42');
  });

  it('non native token', async () => {
    const operation = new DefaultBitrefillOperation(rawNonNativeEventInvoice, tokens);

    expect((await operation.token()).address()).toEqual('0x2791bca1f2de4661ed88a30c99a7a9449aa84174');
  });

  it('non native amount', async () => {
    const operation = new DefaultBitrefillOperation(rawNonNativeEventInvoice, tokens);

    expect(operation.amount()).toEqual(41.05);
  });
});
