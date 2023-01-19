import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { DefaultBlockchain } from "../../blockchain/blockchain";
import { rawEthereumData } from "../../fixtures/raw-blockchains-data";
import { rawApproveData } from "../../fixtures/raw-one-inch-response-data";
import { OneInchFactory } from "./one-inch.factory";


describe('One Inch Factory', () => {

  let dexFactory: OneInchFactory;

  beforeEach(() => {
    dexFactory = new OneInchFactory(null);
  });

  it('new', () => {
    expect(dexFactory).toBeTruthy();
  })

  it('create', () => {
    const dex = dexFactory.create(
      new DefaultBlockchain(rawEthereumData),
      new FakeHttpClient(rawApproveData)
    );

    expect(dex).toBeTruthy();
  });
});
