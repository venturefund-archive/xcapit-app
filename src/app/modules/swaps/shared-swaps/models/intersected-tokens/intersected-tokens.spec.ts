import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { BlockchainTokens } from "../blockchain-tokens/blockchain-tokens";
import { OneInch } from "../one-inch/one-inch";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { rawEthereumTokensData } from "../fixtures/raw-one-inch-response-data";
import { rawETHData, rawTokensData } from "../fixtures/raw-tokens-data";
import { IntersectedTokens } from "./intersected-tokens";
import { OneInchTokens } from "../one-inch-tokens/one-inch-tokens";
import { DefaultToken } from "../token/token";
import { TokenRepo } from "../token-repo/token-repo";
import { DefaultTokens, Tokens } from "../tokens/tokens";
import { DefaultBlockchain } from "../blockchain/blockchain";


describe('Intersected Tokens', () => {

  let tokens: Tokens;

  beforeEach(() => {
    const blockchain = new DefaultBlockchain(rawEthereumData)
    tokens = new IntersectedTokens(
      new BlockchainTokens(
        blockchain,
        new DefaultTokens(new TokenRepo(rawTokensData)),
      ),
      new OneInchTokens(
        new OneInch(
          blockchain,
          new FakeHttpClient(rawEthereumTokensData)
        )
      )
    );
  });

  it('new', () => {
    expect(tokens).toBeTruthy();
  });

  it('value access', async () => {
    expect((await tokens.value()).length).toEqual(1);
  });

  it('token access from value', async () => {
    const expectedToken = new DefaultToken(rawETHData);

    expect((await tokens.value())[0].symbol()).toEqual(expectedToken.symbol());
  });
});
