import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { OneInch } from "../one-inch/one-inch";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { rawEthereumTokensData, rawSTXTokenData } from "../fixtures/raw-one-inch-response-data";
import { OneInchTokens } from "./one-inch-tokens";
import { Tokens } from "../tokens/tokens";
import { DefaultBlockchain } from "../blockchain/blockchain";


describe('OneInchTokens', () => {

  let tokens: Tokens;

  beforeEach(() => {
    tokens = new OneInchTokens(new OneInch(
      new DefaultBlockchain(rawEthereumData),
      new FakeHttpClient(rawEthereumTokensData)
    ));
  });

  it('new', () => {
    expect(tokens).toBeTruthy();
  });

  it('value', async () => {
    expect(tokens.value()).toBeTruthy();
  });

  it('access to an individual token', async () => {
    const token = (await tokens.value())[0];

    expect(token.symbol()).toEqual(rawSTXTokenData.symbol);
  });
});
