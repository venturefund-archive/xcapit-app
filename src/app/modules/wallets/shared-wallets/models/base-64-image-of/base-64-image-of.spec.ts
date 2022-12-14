import { BlobOf } from "src/app/shared/models/asset/blob-of/blob-of";
import { Base64ImageOf } from "./base-64-image-of";
let base64ImageOf: Base64ImageOf;
let fileReader: FileReader;
let blobSpy: jasmine.SpyObj<BlobOf>;
beforeEach(() => {
  blobSpy = jasmine.createSpyObj('BlobOf', {
    value: new Blob(['a']),
  });
  fileReader = new FileReader();
  base64ImageOf = new Base64ImageOf(blobSpy, fileReader);
});

describe('Base64ImageOf', () => {
    it('should create', () => {
      expect(base64ImageOf).toBeTruthy();
    });

    it('value', async () => {
        expect(await base64ImageOf.value()).toEqual('data:application/octet-stream;base64,YQ==')
    })
  });