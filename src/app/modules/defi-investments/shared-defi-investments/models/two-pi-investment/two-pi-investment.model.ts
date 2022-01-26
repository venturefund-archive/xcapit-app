import { Wallet } from 'ethers';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import { ERC20Contract } from '../erc20-contract/erc20-contract.model';
import { ERC20Provider } from '../erc20-provider/erc20-provider.model';
import { ERC20Token } from '../erc20-token/erc20-token.model';

export interface Investment {
  balance(): number;
  deposit(amount: number): any;
  withdraw(): any;
}

export class TwoPiInvestment implements Investment {
  constructor(private _aProduct: InvestmentProduct, private _aWallet: Wallet) {}

  balance(): number {
    // const contract = this.createContract(product);
    // const wallets = await this.storageService.getWalletFromStorage();
    // return parseInt(await contract.balanceOf(product.id(), wallets.addresses.MATIC));
    return;
  }

  deposit(amount: number): any {
    // La wallet del usuario para la network del token

    // Hacer el approve
    const token = new ERC20Token(new ERC20Contract(new ERC20Provider(this._aProduct.token()), this._aWallet));
    token.approve(this._aProduct.contractAddress(), amount);

    // Hacer el deposito
    return;
  }

  withdraw(): any {
    return;
  }
}
