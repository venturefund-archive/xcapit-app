import { RawPolygonGS } from '../polygon-gas-price/polygon-gas-price';

export const rawPolygonGasStation: RawPolygonGS = {
  safeLow: { maxPriorityFee: 33.664479934266666, maxFee: 35.494281265266665 },
  standard: {
    maxPriorityFee: 30,
    maxFee: '178.885791131',
  },
  fast: {
    maxPriorityFee: '38.447176140',
    maxFee: '187.332967271',
  },
  estimatedBaseFee: 1.829801331,
  blockTime: 2,
  blockNumber: 30375091,
};
