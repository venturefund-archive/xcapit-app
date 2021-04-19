import { TestBed } from '@angular/core/testing';
import { PlatformService } from './platform.service';

fdescribe('PlatformService', () => {
  let service: PlatformService;
  let capacitorMock: any;

  beforeEach(() => {
    capacitorMock = {
      platform: 'web'
    };

    TestBed.configureTestingModule({
      providers: []
    });
    service = TestBed.inject(PlatformService);
    service.capacitor = capacitorMock;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should isWeb return true on web platform', () => {
    expect(service.isWeb()).toBeTrue();
  });

  it('should isWeb return false on web platform', () => {
    service.capacitor.platform = 'aosdika';
    expect(service.isWeb()).toBeFalse();
  });

});
