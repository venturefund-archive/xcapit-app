import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';
import { NFT_DATA_NONPROD } from '../../constants/nft-data-nonprod';
import { NFT_DATA_PROD } from '../../constants/nft-data-prod';
import { BlockchainProviderService } from '../blockchain-provider/blockchain-provider.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';

@Injectable({
  providedIn: 'root',
})
export class NftService {
  data: any;
  env = environment.environment;

  constructor(
    private storageService: StorageService,
    private blockchainProviderService: BlockchainProviderService,
    private http: CustomHttpService
  ) {
    this.data = this.getNFTsXcapit();
  }

  private async getUserWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    const address = wallet.addresses.MATIC;
    return address;
  }

  async createContract(data) {
    return this.blockchainProviderService.createContract(
      data.contractAddress,
      data.abi,
      this.blockchainProviderService.createProvider(data.rpc)
    );
  }

  private getMetadata(metadataURL) {
    return this.http.get(metadataURL, undefined, undefined, false);
  }

  getNFTsXcapit() {
    return this.env === 'PRODUCCION' ? NFT_DATA_PROD : NFT_DATA_NONPROD;
  }

  async getNFTMetadata() {
    const nfts = [];
    for (const item of this.data) {
      const contract = await this.createContract(item);
      const nftList = await contract.walletOfOwner(this.getUserWalletAddress());
      if (nftList.length) {
        const metadataURL = await contract.tokenURI(nftList[0]);
        const metadata = await this.getMetadata(metadataURL).toPromise();
        nfts.push(await this.NFTMetadataResponse(metadata, nftList[0], item.contractAddress));
      }
    }
    return nfts;
  }

  private NFTMetadataResponse(metadata: any, tokenID: number, contractAddress: string) {
    return Promise.resolve(Object.assign(metadata, { tokenID }, { contractAddress }));
  }
}
