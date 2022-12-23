import { Blockchain } from '../blockchain/blockchain';
import { Wallet, DefaultWallet, SolanaWallet } from '../wallet/wallet';
import { Wallet as EthersWallet, ethers } from 'ethers';
import { DataRepo } from '../wallet-repo/data-repo.interface';
import { Password } from '../password/password';
import { Blockchains } from '../blockchains/blockchains';
import { SolanaDerivedWallet } from '../solana-derived-wallet/solana-derived-wallet';
import { WalletCreationMethod } from 'src/app/shared/types/wallet-creation-method.type';

export class Wallets {
  constructor(private _dataRepo: DataRepo, private _blockchains: Blockchains, private _ethersWallet: any = EthersWallet) {}

  async oneBy(aBlockchain: Blockchain): Promise<Wallet> {
    const creationMethod = await this._dataRepo.creationMethod();
    const rawData = await this._rawWalletData(aBlockchain);

    if (this._isSolana(aBlockchain)) {
      return SolanaWallet.create(rawData, aBlockchain);
    } 

    if (creationMethod === 'legacy') {
      return new DefaultWallet(rawData, aBlockchain);
    }

    return new DefaultWallet(rawData, this._blockchains.oneByName('ERC20'));
  }

  async createFrom(
    aPhrase: string,
    aPassword: Password,
    creationMethod: WalletCreationMethod
  ): Promise<void> {
    await this._dataRepo.save(
      this._addressesFrom(aPhrase, creationMethod),
      await this._erc20Wallet(aPhrase).encrypt(aPassword.value(), {
        scrypt: {
          N: 1,
        },
      })
    );
  }

  private _addressesFrom(aPhrase: string, creationMethod: WalletCreationMethod) {
    const addresses = {};
    const erc20Blockchain = this._blockchains.oneByName('ERC20');
    for (const blockchain of this._blockchains.value()) {
      if (this._isSolana(blockchain)) {
        addresses[blockchain.name()] = this._solanaDerivedAddressFor(aPhrase, blockchain);
      } else {
        const creationBlockchain = creationMethod === 'default' ? erc20Blockchain : blockchain;
        addresses[blockchain.name()] = this._ethersWalletFor(aPhrase, creationBlockchain).address.toLowerCase();
      }
    }
    return addresses;
  }

  private _isSolana(blockchain: Blockchain): boolean {
    return blockchain.name() === 'SOLANA';
  }

  private _solanaDerivedAddressFor(aPhrase: string, blockchain: Blockchain): string {
    return new SolanaDerivedWallet(aPhrase, blockchain).address();
  }

  private _erc20Wallet(aPhrase: string): EthersWallet {
    return this._ethersWalletFor(aPhrase, this._blockchains.oneByName('ERC20'));
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
}
