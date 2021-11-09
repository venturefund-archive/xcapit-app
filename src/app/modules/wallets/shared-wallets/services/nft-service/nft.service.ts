import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';
import { NFT_DATA_NONPROD } from '../../constants/nft-data-nonprod';
import { NFT_DATA_PROD } from '../../constants/nft-data-prod';
import { NFT } from '../../interfaces/nft.interface';
import { BlockchainProviderService } from '../blockchain-provider/blockchain-provider.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';

@Injectable({
  providedIn: 'root',
})
export class NftService {
  data: NFT;
  env = environment.environment;

  constructor(
    private storageService: StorageService,
    private blockchainProviderService: BlockchainProviderService,
    private http: CustomHttpService
  ) {
    this.data = this.getNFTMexico();
  }

  private async getUserWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    const address = wallet.addresses.MATIC;
    return address;
  }

  private createProvider() {
    const provider = this.blockchainProviderService.createProvider(this.data.rpc);
    return provider;
  }

  private createContract() {
    return this.blockchainProviderService.createContract(
      this.data.contractAddress,
      this.data.abi,
      this.createProvider()
    );
  }

  private formatNftList(NFTList) {
    const formattedList = [];
    NFTList.forEach((data) => {
      formattedList.push(parseInt(data._hex.replace('0x0', ''), 10));
    });
    return Promise.resolve(formattedList);
  }

  private getMetadata(metadataURL) {
    return this.http.get(metadataURL, undefined, undefined, false);
  }

  getNFTMexico(): NFT {
    return this.env === 'PRODUCCION' ? NFT_DATA_PROD : NFT_DATA_NONPROD;
  }

  getNFTMetadata() {
    const contract = this.createContract();
    return contract
      .walletOfOwner(this.getUserWalletAddress())
      .then((nftList) => this.formatNftList(nftList))
      .then((formattedList) => {
        if (formattedList.length > 0) {
          return contract.tokenURI(formattedList[0]).then((metadataURL) => {
            return this.getMetadata(metadataURL).toPromise();
          });
        }
      });
  }
}
