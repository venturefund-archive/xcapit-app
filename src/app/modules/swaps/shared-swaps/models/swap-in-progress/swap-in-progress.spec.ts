import { IonicStorageService } from "src/app/shared/services/ionic-storage/ionic-storage.service";
import { SwapInProgress } from "./swap-in-progress";


describe('SwapInProgress', () => {
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  let swapInProgress: SwapInProgress;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('IonicStorageService', { get: Promise.resolve(0), set: Promise.resolve() });
    swapInProgress = new SwapInProgress(storageSpy);
  });

  it('new', () => {
    expect(swapInProgress).toBeTruthy();
  });

  it('start ', () => {
    swapInProgress.start();
    expect(storageSpy.set).toHaveBeenCalledOnceWith('swapInProgress',1);
  });

  it('finish', () => {
    swapInProgress.finish();
    expect(storageSpy.set).toHaveBeenCalledOnceWith('swapInProgress',0)
  });
});
