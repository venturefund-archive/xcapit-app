import { FilesystemPlugin, WriteFileResult } from '@capacitor/filesystem';
import { ReadAsset } from '../read-asset/read-asset';
import { CachedAsset } from './cached-asset';

describe('CachedAsset', () => {
  let fileSystemSpy: jasmine.SpyObj<FilesystemPlugin>;
  let readAssetSpy: jasmine.SpyObj<ReadAsset>;
  let cachedAsset: CachedAsset;

  beforeEach(() => {
    fileSystemSpy = jasmine.createSpyObj('FilesystemPlugin', {
      writeFile: Promise.resolve({ uri: 'file.jpg' } as WriteFileResult),
    });
    readAssetSpy = jasmine.createSpyObj('ReadAsset', {
      value: Promise.resolve('something'),
    });
    cachedAsset = new CachedAsset(readAssetSpy, fileSystemSpy, 'file.jpg');
  });

  it('new', () => {
    expect(cachedAsset).toBeTruthy();
  });

  it('value with file name', async () => {
    expect((await cachedAsset.value()).uri).toEqual('file.jpg');
  });

  it('value with auto-generated file name', async () => {
    fileSystemSpy.writeFile.and.resolveTo({ uri: new Date().getTime() + '.jpg' });
    const cachedAssetWithoutFileName = new CachedAsset(readAssetSpy, fileSystemSpy);
    expect((await cachedAssetWithoutFileName.value()).uri.split('.')[1]).toEqual('jpg');
  });
});
