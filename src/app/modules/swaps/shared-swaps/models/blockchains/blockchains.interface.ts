import { Blockchain } from "../blockchain/blockchain";

export interface Blockchains {
    value(): Blockchain[];
    oneByName(aBlockchainName: string): Blockchain;
    oneById?(aBlockchainId: string): Blockchain;
  }
  