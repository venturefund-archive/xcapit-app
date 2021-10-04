import { TestBed } from '@angular/core/testing';
import { SafeURLPipe } from './safe-url.pipe';

describe('SafeURLPipe', () => {
  let pipe: SafeURLPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SafeURLPipe],
      providers: [SafeURLPipe],
    });
    pipe = TestBed.inject(SafeURLPipe);
  });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
