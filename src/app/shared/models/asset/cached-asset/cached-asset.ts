import { FilesystemPlugin, WriteFileResult, Directory } from '@capacitor/filesystem';
import { ReadAsset } from '../read-asset/read-asset';

export class CachedAsset {
  constructor(
    private readonly readAsset: ReadAsset,
    private readonly fileSystem: FilesystemPlugin,
    private readonly fileName?: string
  ) {}

  async value(): Promise<WriteFileResult> {
    return this.fileSystem.writeFile({
      directory: Directory.Cache,
      path: this.fileName ? this.fileName : this.getFileName(),
      data: await this.readAsset.value(),
    });
  }

  private getFileName(): string {
    return new Date().getTime() + '.jpg';
  }
}
