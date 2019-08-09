import { TestBed } from '@angular/core/testing';
import { XhrResponseHandlerService } from './xhr-response-handler.service';
import { TranslateModule } from '@ngx-translate/core';

describe('XhrResponseHandlerService', () => {
  let service: XhrResponseHandlerService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()]
    });
    service = TestBed.get(XhrResponseHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
