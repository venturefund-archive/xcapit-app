import { Blockchain } from '../blockchain/blockchain';
import { Wallet, DefaultWallet, SolanaWallet } from '../wallet/wallet';
import { Wallet as EthersWallet, ethers } from 'ethers';
import { DataRepo } from '../wallet-repo/data-repo.interface';
import { Password } from '../password/password';
import { Blockchains } from '../blockchains/blockchains';
import { Keypair } from '@solana/web3.js';

export class Wallets {
  constructor(
    private _dataRepo: DataRepo,
    private _ethersWallet: any = EthersWallet,
    private _solanaKeypair: any = Keypair
  ) {}

  async oneBy(aBlockchain: Blockchain): Promise<Wallet> {
    const rawData = await this._rawWalletData(aBlockchain);

    return this._isSolana(aBlockchain) ? new SolanaWallet(rawData) : new DefaultWallet(rawData, aBlockchain);
  }

  async createFrom(aPhrase: string, aPassword: Password, blockchains: Blockchains): Promise<void> {
    await this._dataRepo.save(
      this._addressesFrom(aPhrase, blockchains),
      await this._erc20Wallet(aPhrase, blockchains).encrypt(aPassword.value())
    );
  }

  private _addressesFrom(aPhrase: string, blockchains: Blockchains) {
    const addresses = {};
    for (const blockchain of blockchains.value()) {
      addresses[blockchain.name()] = this._isSolana(blockchain)
        ? this._solanaWalletFor(aPhrase).publicKey.toString()
        : this._ethersWalletFor(aPhrase, blockchain).address;
    }
    return addresses;
  }

  private _isSolana(blockchain: Blockchain): boolean {
    return blockchain.name() === 'SOLANA';
  }

  private _solanaWalletFor(aPhrase: string): Keypair {
    return this._solanaKeypair.fromSeed(ethers.utils.arrayify(ethers.utils.mnemonicToSeed(aPhrase)).slice(0, 32));
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
}
