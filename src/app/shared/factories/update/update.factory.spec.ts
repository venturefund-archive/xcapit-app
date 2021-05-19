import { TestBed } from '@angular/core/testing';
import { UpdateFactory } from './update.factory';

describe('UpdateService', () => {
  let service: UpdateFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateFactory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
