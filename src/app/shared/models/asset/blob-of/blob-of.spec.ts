import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { BlobOf } from './blob-of';

describe('BlobOf', () => {
  let fakeHttpClient: FakeHttpClient;
  let blobOf: BlobOf;

  beforeEach(() => {
    fakeHttpClient = new FakeHttpClient(new Blob([]));
    blobOf = new BlobOf('assets/test_image.svg', fakeHttpClient);
  });

  it('new', () => {
    expect(blobOf).toBeTruthy();
  });

  it('value', async () => {
    expect(await blobOf.value()).toEqual(new Blob([]));
  });
});
