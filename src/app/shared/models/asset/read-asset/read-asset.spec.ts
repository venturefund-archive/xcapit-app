import { ReadAsset } from './read-asset';
import { BlobOf } from '../blob-of/blob-of';

describe('ReadAsset', () => {
  let readAsset: ReadAsset;
  let fileReader: FileReader;
  let blobSpy: jasmine.SpyObj<BlobOf>;

  beforeEach(() => {
    blobSpy = jasmine.createSpyObj('BlobOf', {
      value: new Blob(['a']),
    });
    fileReader = new FileReader();
    readAsset = new ReadAsset(blobSpy, fileReader);
  });

  it('new', () => {
    expect(readAsset).toBeTruthy();
  });

  it('value', async () => {
    expect(await readAsset.value()).toEqual('data:application/octet-stream;base64,YQ==');
  });
});
