import { NFT } from './nft.class';
import { environment } from 'src/environments/environment';


export class UrlImageOf {
  constructor(private _aNFT: NFT, private _aGatewayUrl: string = environment.IPFS_GATEWAY) {}

  value(): string {
    return this.useIPFSProtocol() ? this.imageTroughGateway() : this._aNFT.image();
  }

  private useIPFSProtocol(): boolean {
    return /^ipfs:\/\//.test(this._aNFT.image());
  }

  private imageTroughGateway(): string {
    return `${this._aGatewayUrl}/${this._aNFT.image().replace('ipfs://', '')}`;
  }
}
