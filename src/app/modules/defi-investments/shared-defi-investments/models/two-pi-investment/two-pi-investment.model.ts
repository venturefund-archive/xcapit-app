import { InvestmentProduct } from '../../interfaces/investment-product.interface';

export interface Investment {
  product: InvestmentProduct;
  balance(): number;
  deposit(): any;
  withdraw(): any;
}

export class TwoPiInvestment implements Investment {
  product: InvestmentProduct;

  constructor(product: InvestmentProduct) {
    this.product = product;
  }

  balance(): number {
    // const contract = this.createContract(product);
    // const wallets = await this.storageService.getWalletFromStorage();
    // return parseInt(await contract.balanceOf(product.id(), wallets.addresses.MATIC));
    return;
  }

  deposit(): any {
    return;
  }

  withdraw(): any {
    return;
  }
}
