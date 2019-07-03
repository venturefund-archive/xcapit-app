import { TestBed } from '@angular/core/testing';

import { ShareService } from './share.service';
import { TranslateModule } from '@ngx-translate/core';

describe('ShareService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot()]
  }));

  it('should be created', () => {
    const service: ShareService = TestBed.get(ShareService);
    expect(service).toBeTruthy();
  });
});
