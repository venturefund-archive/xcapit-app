import { ethers } from "ethers";
import { EtherWallet } from "./ether-wallet"
const testWallet: ethers.Wallet = { address: 'testAddress' } as ethers.Wallet;
const testDertivedPath = "m/44'/60'/0'/0/0";
const testMnemonicPhrase = 'test mnemonic phrase';
describe('EtherWallet', () => {
    let etherWallet: EtherWallet;
    let ethersFromMnemonicSpy: jasmine.Spy;

    beforeEach(() => {
        ethersFromMnemonicSpy = spyOn(ethers.Wallet, 'fromMnemonic').and.returnValue(testWallet);
        etherWallet = new EtherWallet(testMnemonicPhrase, testDertivedPath);
    })

    it('new', () => {
        expect(etherWallet).toBeTruthy();
        expect(etherWallet.address).toBeDefined();
    });
    
    it('isSolana', ()=>{
        expect(etherWallet.isSolana()).toBeFalse()
      })
})