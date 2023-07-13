import { WCStorageService } from '../../../services/wallet-connect/wc-storage/wc-storage.service';

export class ExistingProposal {
  constructor(private readonly WCStorageService: WCStorageService) {}

  async exists(): Promise<boolean> {
    const { proposal, chainId } = await this.getProposalKeys();
    return !!(proposal && chainId);
  }

  value(): Promise<{ proposal: any; chainId: string }> {
    return this.getProposalKeys();
  }

  private async getProposalKeys(): Promise<{ proposal: any; chainId: string }> {
    return {
      proposal: JSON.parse(await this.WCStorageService.get('current_proposal')),
      chainId: await this.WCStorageService.get('proposal_wallet_chain_id'),
    };
  }
}