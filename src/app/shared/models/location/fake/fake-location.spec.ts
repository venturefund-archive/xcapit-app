import { Location } from '../location.interface';
import { FakeLocation } from './fake-location';

describe('FakeLocation', () => {
  let fakeLocation: Location;

  beforeEach(() => {
    fakeLocation = new FakeLocation('/path/to/url');
  });

  it('new', () => {
    expect(fakeLocation).toBeTruthy();
  });

  it('href', () => {
    expect(fakeLocation.href()).toEqual('/path/to/url');
  });
});
