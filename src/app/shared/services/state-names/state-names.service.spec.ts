import { TestBed } from '@angular/core/testing';

import { StateNamesService } from './state-names.service';
import { TranslateModule } from '@ngx-translate/core';

describe('StateNamesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({})
      ]
    })
  );

  it('should be created', () => {
    const service: StateNamesService = TestBed.get(StateNamesService);
    expect(service).toBeTruthy();
  });

  it('should return valid name on active state', () => {
    const service: StateNamesService = TestBed.get(StateNamesService);
    const returnValue = service.getStateShowName('active');
    expect(returnValue).toBeDefined();
    expect(returnValue).not.toBe('-');
  });
  it('should return valid name on toBTC-NF state', () => {
    const service: StateNamesService = TestBed.get(StateNamesService);
    const returnValue = service.getStateShowName('toBTC-NF');
    expect(returnValue).toBeDefined();
    expect(returnValue).not.toBe('-');
  });
  it('should return valid name on toBTC state', () => {
    const service: StateNamesService = TestBed.get(StateNamesService);
    const returnValue = service.getStateShowName('toBTC');
    expect(returnValue).toBeDefined();
    expect(returnValue).not.toBe('-');
  });
  it('should return valid name on toUSDT state', () => {
    const service: StateNamesService = TestBed.get(StateNamesService);
    const returnValue = service.getStateShowName('toUSDT');
    expect(returnValue).toBeDefined();
    expect(returnValue).not.toBe('-');
  });
  it('should return valid name on finalizado state', () => {
    const service: StateNamesService = TestBed.get(StateNamesService);
    const returnValue = service.getStateShowName('finalizado');
    expect(returnValue).toBeDefined();
    expect(returnValue).not.toBe('-');
  });
  it('should return valid name on pausado state', () => {
    const service: StateNamesService = TestBed.get(StateNamesService);
    const returnValue = service.getStateShowName('pausado');
    expect(returnValue).toBeDefined();
    expect(returnValue).not.toBe('-');
  });
  it('should return valid name on invalid state', () => {
    const service: StateNamesService = TestBed.get(StateNamesService);
    const returnValue = service.getStateShowName('invalidState');
    expect(returnValue).toBeDefined();
    expect(returnValue).toBe('-');
  });
});
