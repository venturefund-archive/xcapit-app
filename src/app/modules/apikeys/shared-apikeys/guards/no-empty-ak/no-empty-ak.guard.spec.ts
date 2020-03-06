import { TestBed } from '@angular/core/testing';
import { NoEmptyAKGuard } from './no-empty-ak.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { of } from 'rxjs';
import { ApiUsuariosService } from 'src/app/modules/usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';

describe('NoEmptyAKGuard', () => {
  let service: NoEmptyAKGuard;
  let apiUsuariosMock: any;
  let apiUsuariosService;

  beforeEach(() => {
    apiUsuariosMock = {
      status: () => of({})
    };
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'funds/fund-name', component: DummyComponent }
        ])
      ],
      providers: [
        NoEmptyAKGuard,
        { provide: ApiUsuariosService, useValue: apiUsuariosMock }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(NoEmptyAKGuard);
    apiUsuariosService = TestBed.get(ApiUsuariosService);
  });

  it('should ...', () => {
    expect(NoEmptyAKGuard).toBeTruthy();
  });

  it('should be able to hit route when has not empty', () => {
    const spy = spyOn(apiUsuariosService, 'status');
    spy.and.returnValue(of({ empty_linked_keys: false, profile_valid: true }));
    service.canActivate().subscribe(result => expect(result).toBe(true));
  });

  it('should not be able to hit route when has empty', () => {
    const spy = spyOn(apiUsuariosService, 'status');
    spy.and.returnValue(of({ empty_linked_keys: true, profile_valid: true }));
    service.canActivate().subscribe(result => expect(result).toBe(false));
  });
});
