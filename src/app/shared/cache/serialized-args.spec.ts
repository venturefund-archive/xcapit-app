import { SerializedArgs } from './serialized-args';

class D {
  proppp = 3;
  constructor(_a) {}
  aa() {
    return this.proppp;
  }
}

describe('SerializedArgs', () => {
  const args = [1, new D(3)];
  let serializedArgs: SerializedArgs;
  const expectedValue = '5rJtIPQQfoQBVKDOa346fFwC+SR77uflG2C3e+LXU73Xq4mrp8uUkzDzUHaDSqBhAJeA++VeLZ/FlNHhvhoQRQ==';

  beforeEach(() => {
    serializedArgs = new SerializedArgs(args);
  });

  it('new', () => {
    expect(serializedArgs).toBeTruthy();
  });

  it('value', () => {
    expect(serializedArgs.value()).toEqual(expectedValue);
  });
});
