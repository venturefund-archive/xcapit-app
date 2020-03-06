import { TestBed } from '@angular/core/testing';
import { HasFundsGuard } from './has-funds.guard';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';

describe('hasFundsGuard', () => {
  let hasFundsGuard: HasFundsGuard;
  let apiFundsServiceSpy: any;
  beforeEach(() => {
    apiFundsServiceSpy = jasmine.createSpyObj('ApiFundsService', [
      'count'
    ]);
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule,
        RouterTestingModule.withRoutes([
          { path: 'tabs/funds', component: DummyComponent }
        ])
      ],
      providers: [{ provide: ApiFundsService, useValue: apiFundsServiceSpy }]
    });
  });

  beforeEach(() => {
    hasFundsGuard = TestBed.get(HasFundsGuard);
    apiFundsServiceSpy = TestBed.get(ApiFundsService);
  });

  it('should ...', () => {
    expect(hasFundsGuard).toBeTruthy();
  });

  it('should not be able to hit route when has owner funds and no shared', async done => {
    apiFundsServiceSpy.count.and.returnValue(of({ owners: 2, not_owners: 0 }));
    hasFundsGuard.canActivate().subscribe(res => expect(res).toBeFalsy());
    done();
  });

  it('should not be able to hit route when has owner funds and shared', async done => {
    apiFundsServiceSpy.count.and.returnValue(of({ owners: 2, not_owners: 2 }));
    hasFundsGuard.canActivate().subscribe(res => expect(res).toBeFalsy());
    done();
  });

  it('should be able to hit route when has not owner funds and shared', async done => {
    apiFundsServiceSpy.count.and.returnValue(of({ owners: 0, not_owners: 2 }));
    hasFundsGuard.canActivate().subscribe(res => expect(res).toBeTruthy());
    done();
  });

  it('should be able to hit route when has not owner funds and no shared', async done => {
    apiFundsServiceSpy.count.and.returnValue(of({ owners: 0, not_owners: 0 }));
    hasFundsGuard.canActivate().subscribe(res => expect(res).toBeTruthy());
    done();
  });
});
