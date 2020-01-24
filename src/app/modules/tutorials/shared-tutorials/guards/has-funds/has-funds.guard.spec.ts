import { TestBed } from '@angular/core/testing';
import { HasFundsGuard } from './has-funds.guard';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiUsuariosService } from 'src/app/modules/usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';

describe('hasFundsGuard', () => {
  let hasFundsGuard: HasFundsGuard;
  let apiUsuariosServiceSpy: any;
  beforeEach(() => {
    apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', [
      'hasFunds'
    ]);
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          // { path: 'tabs/funds', component: DummyComponent }
        ])
      ],
      providers: [
        { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy }
      ]
    });
  });

  beforeEach(() => {
    hasFundsGuard = TestBed.get(HasFundsGuard);
    apiUsuariosServiceSpy = TestBed.get(ApiUsuariosService);
  });

  it('should ...', () => {
    expect(hasFundsGuard).toBeTruthy();
  });

  it('should not be able to hit route when has_funds is true', async done => {
    apiUsuariosServiceSpy.hasFunds.and.returnValue(of({ has_funds: true }));
    hasFundsGuard.canActivate().subscribe(res => expect(res).toBeFalsy());
    done();
  });

  it('should be able to hit route when has_funds is false', async done => {
    apiUsuariosServiceSpy.hasFunds.and.returnValue(of({ has_funds: false }));
    hasFundsGuard.canActivate().subscribe(res => expect(res).toBeTruthy());
    done();
  });
});
