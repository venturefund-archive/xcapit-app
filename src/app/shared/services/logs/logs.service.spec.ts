import { TestBed } from '@angular/core/testing';

import { LogsService } from './logs.service';
import { HttpClient } from '@angular/common/http';

describe('LogsService', () => {
  let http: any; 
  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', {
      get: () => null,
      post: () => null
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        ]
    });
  });

  it('should be created', () => {
    const service: LogsService = TestBed.get(LogsService);
    expect(service).toBeTruthy();
  });
});
