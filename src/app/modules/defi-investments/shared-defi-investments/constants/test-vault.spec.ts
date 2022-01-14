import { Vault } from '@2pi-network/sdk';

export const TEST_VAULTS = [
  {
    apy: 0.12392847454895217,
    balances: [],
    contract_address: '0xCB50fF1863cBBAd718d3A1eEEf403a95C58d3B16',
    deposits: [],
    identifier: 'usdc_aave',
    pid: 1,
    token: 'USDC',
    token_address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    tvl: 15800500,
  } as Vault,
  {
    apy: -0.0063743965358873,
    balances: [],
    contract_address: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
    deposits: [],
    identifier: 'mumbai_dai',
    pid: 1,
    token: 'DAI',
    token_address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
    tvl: 967067802215235921660857,
  } as Vault,
];
