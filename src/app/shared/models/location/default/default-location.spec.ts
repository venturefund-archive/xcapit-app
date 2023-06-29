import { Location } from '../location.interface';
import DefaultLocation from './default-location';

describe('DefaultLocation', () => {
  let location: Location;

  beforeEach(() => {
    location = new DefaultLocation();
  });

  it('new', () => {
    expect(location).toBeTruthy();
  });

  it('href', () => {
    expect(typeof location.href()).toEqual('string');
  });
});
