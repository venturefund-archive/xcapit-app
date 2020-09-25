import { TestBed } from '@angular/core/testing';

import { CustomHttpService } from './custom-http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoadingService } from '../loading/loading.service';
import { XhrResponseHandlerService } from '../xhr-response-handler/xhr-response-handler.service';

describe('CustomHttpService', () => {
  let service: CustomHttpService;
  let loadingServiceSpy: any;
  let xhrResponseHandlerServiceSpy: any;

  beforeEach(() => {
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
      'show',
      'dismiss'
    ]);
    xhrResponseHandlerServiceSpy = jasmine.createSpyObj(
      'XhrResponseHandlerService',
      ['error']
    );
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: LoadingService, useValue: loadingServiceSpy },
        {
          provide: XhrResponseHandlerService,
          useValue: xhrResponseHandlerServiceSpy
        }
      ]
    });
    service = TestBed.inject(CustomHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return HttpClient Object', () => {
    expect(service.original).toBeTruthy();
  });
});
