import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';

export const rawProviderCoinsData: Coin[] = [
  { id:1, name:'USDCUSDT',value: 'USDC', network: 'MATIC', logoRoute: '', last: false, chainId: 1, rpc: '' },
  { id:2, name:'MATICUSDT',value: 'MATIC', network: 'MATIC', logoRoute: '', last: false, chainId: 1, rpc: '' },
  { id:3, name:'DAIUSDT',value: 'DAI', network: 'MATIC', logoRoute: '', last: false, chainId: 1, rpc: '' },
  { id:3, name:'ETHERC20',value: 'ETH', network: 'ERC20', logoRoute: '', last: false, chainId: 2, rpc: '' },
];
