import { WCStorageService } from '../../../services/wallet-connect/wc-storage/wc-storage.service';
import { JSONProposal, rawStoredProposal } from '../../fixtures/raw-proposal';
import { ExistingProposal } from './existing-proposal';

describe('ExistingProposal', () => {
  let WCStorageServiceSpy: jasmine.SpyObj<WCStorageService>;
  let existingProposal: ExistingProposal;

  beforeEach(() => {
    WCStorageServiceSpy = jasmine.createSpyObj('WCStorageService', {
      get: Promise.resolve(),
    });
    WCStorageServiceSpy.get.withArgs('current_proposal').and.resolveTo(rawStoredProposal);
    WCStorageServiceSpy.get.withArgs('proposal_wallet_chain_id').and.resolveTo('137');

    existingProposal = new ExistingProposal(WCStorageServiceSpy);
  });

  it('new', () => {
    expect(existingProposal).toBeTruthy();
  });

  it('exists when the storage keys exist', async () => {
    expect(await existingProposal.exists()).toBeTrue();
  });

  it('not exist when at least one of the storage keys do not exist', async () => {
    WCStorageServiceSpy.get.withArgs('current_proposal').and.resolveTo(null);
    expect(await existingProposal.exists()).toBeFalse();
  });

  it('value', async () => {
    expect((await existingProposal.value()).proposal.id).toEqual(JSONProposal.id);
	});
});

