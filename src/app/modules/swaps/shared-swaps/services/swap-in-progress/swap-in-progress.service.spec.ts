import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { IonicStorageService } from "src/app/shared/services/ionic-storage/ionic-storage.service";
import { SwapInProgressService } from "./swap-in-progress.service";

describe('SwapInProgressService', () => {
    let service: SwapInProgressService;
    let storageSpy: jasmine.SpyObj<IonicStorageService>;
    
  
    beforeEach(() => {
        storageSpy = jasmine.createSpyObj('IonicStorageService', {
            startSwap: null,
            finishSwap: null,
            inProgress: of(),
          });

          

      TestBed.configureTestingModule({});
      service = TestBed.inject(SwapInProgressService);
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should ', () => {
        
    });

});