import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { DefaultBlockchain } from "../../blockchain/blockchain";
import { rawEthereumData } from "../../fixtures/raw-blockchains-data";
import { rawEthereumTokensData } from "../../fixtures/raw-one-inch-response-data";
import { OneInch } from "../../one-inch/one-inch";
import { OneInchTokensFactory } from "./one-inch-tokens.factory";


describe('One Inch Tokens Factory', () => {

  let factory: OneInchTokensFactory;

  beforeEach(() => {
    factory = new OneInchTokensFactory();
  });

  it('new', () => {
    expect(factory).toBeTruthy();
  });

  it('create', () => {
    const tokens = factory.create(new OneInch(
      new DefaultBlockchain(rawEthereumData),
      new FakeHttpClient(rawEthereumTokensData)
    ));

    expect(tokens).toBeTruthy();
  });
});
