import { Blockchain } from '../blockchain/blockchain';
import { Wallet, DefaultWallet, SolanaWallet } from '../wallet/wallet';
import { Wallet as EthersWallet, ethers } from 'ethers';
import { DataRepo } from '../wallet-repo/data-repo.interface';
import { Password } from '../password/password';
import { Blockchains } from '../blockchains/blockchains';
import { SolanaDerivedWallet } from '../solana-derived-wallet/solana-derived-wallet';
import { WalletCreationMethod } from 'src/app/shared/types/wallet-creation-method.type';
import { BlockchainMM } from '../blockchain-mm/blockchain-mm';

export class Wallets {
  constructor(private _dataRepo: DataRepo, private _ethersWallet: any = EthersWallet) {}

  async oneBy(aBlockchain: Blockchain): Promise<Wallet> {
    const rawData = await this._rawWalletData(aBlockchain);

    return this._isSolana(aBlockchain)
      ? SolanaWallet.create(rawData, aBlockchain)
      : new DefaultWallet(
        rawData,
        this._blockchainByCreationMethod(aBlockchain, await this._dataRepo.creationMethod())
      );
  }

  async createFrom(
    aPhrase: string,
    aPassword: Password,
    blockchains: Blockchains,
    creationMethod: WalletCreationMethod,
  ): Promise<void> {
    await this._dataRepo.save(
      this._addressesFrom(aPhrase, blockchains, creationMethod),
      await this._erc20Wallet(aPhrase, blockchains).encrypt(aPassword.value(), {
        scrypt: {
          N: 1,
        },
      })
    );
  }

  private _addressesFrom(aPhrase: string, blockchains: Blockchains, creationMethod: WalletCreationMethod) {
    const addresses = {};
    for (const blockchain of blockchains.value()) {
      if (this._isSolana(blockchain)) {
        addresses[blockchain.name()] = this._solanaDerivedAddressFor(aPhrase, blockchain);
      } else {
        addresses[blockchain.name()] = this._ethersWalletFor(
          aPhrase,
          this._blockchainByCreationMethod(blockchain, creationMethod)
        ).address.toLowerCase();
      }
    }
    console.log('addresses', addresses);
    return addresses;
  }

  private _isSolana(blockchain: Blockchain): boolean {
    return blockchain.name() === 'SOLANA';
  }

  private _solanaDerivedAddressFor(aPhrase: string, blockchain: Blockchain): string {
    return new SolanaDerivedWallet(aPhrase, blockchain).address();
  }

  private _erc20Wallet(aPhrase: string, blockchains: Blockchains): EthersWallet {
    return this._ethersWalletFor(aPhrase, blockchains.oneByName('ERC20'));
  }

  private _ethersWalletFor(aPhrase: string, blockchain: Blockchain): EthersWallet {
    return this._ethersWallet.fromMnemonic(aPhrase, blockchain.derivedPath(), ethers.wordlists.en);
  }

  private async _rawWalletData(aBlockchain: Blockchain): Promise<any> {
    return {
      address: await this._dataRepo.addressByName(aBlockchain.name()),
      encryptedWallet: await this._dataRepo.encryptedRootWallet(),
    };
  }

  private _blockchainByCreationMethod(blockchain: Blockchain, creationMethod: WalletCreationMethod): Blockchain {
    return creationMethod === 'default' ? new BlockchainMM(blockchain) : blockchain;
  }
}
