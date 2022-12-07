import { FilesystemPlugin, WriteFileResult } from '@capacitor/filesystem';
import { Base64ImageOf } from 'src/app/modules/wallets/shared-wallets/models/base-64-image-of/base-64-image-of';
import { CachedAsset } from './cached-asset';

describe('CachedAsset', () => {
  let fileSystemSpy: jasmine.SpyObj<FilesystemPlugin>;
  let base64ImageOfSpy: jasmine.SpyObj<Base64ImageOf>;
  let cachedAsset: CachedAsset;

  beforeEach(() => {
    fileSystemSpy = jasmine.createSpyObj('FilesystemPlugin', {
      writeFile: Promise.resolve({ uri: 'file.jpg' } as WriteFileResult),
    });
    base64ImageOfSpy = jasmine.createSpyObj('Base64ImageOf', {
      value: Promise.resolve('something'),
    });
    cachedAsset = new CachedAsset(base64ImageOfSpy, fileSystemSpy, 'file.jpg');
  });

  it('new', () => {
    expect(cachedAsset).toBeTruthy();
  });

  it('value with file name', async () => {
    expect((await cachedAsset.value()).uri).toEqual('file.jpg');
  });

  it('value with auto-generated file name', async () => {
    fileSystemSpy.writeFile.and.resolveTo({ uri: new Date().getTime() + '.jpg' });
    const cachedAssetWithoutFileName = new CachedAsset(base64ImageOfSpy, fileSystemSpy);
    expect((await cachedAssetWithoutFileName.value()).uri.split('.')[1]).toEqual('jpg');
  });
});
