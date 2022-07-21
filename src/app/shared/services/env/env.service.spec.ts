import { TestBed } from '@angular/core/testing';
import { EnvService } from './env.service';

describe('EnvService', () => {
  let service: EnvService;
  let envMock: any;
  beforeEach(() => {
    envMock = { environment: 'NONPROD' };
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvService);
    service.env = envMock;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all variables', () => {
    expect(service.all()).toBeTruthy(envMock);
  });

  it('should return variable by key', () => {
    expect(service.byKey('environment')).toBeTruthy('NONPROD');
  });
});
