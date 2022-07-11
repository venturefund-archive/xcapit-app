import { Blockchain } from './blockchain/blockchain';
import { rawPolygonData } from './fixtures/raw-blockchains-data';
import { providers } from './fakes/fake-ethers-providers';
import { BigNumber, utils } from 'ethers';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { HttpClient } from '@angular/common/http';



export class GasStationOf {

  constructor(private aBlockchain: Blockchain) {
    console.log("hi")
  }
}




fdescribe('Gas Station Of', () => {

  it('new', () => {
    expect(new GasStationOf(new Blockchain(rawPolygonData))).toBeTruthy();
  });
});
