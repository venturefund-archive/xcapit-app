import { FilesystemPlugin, WriteFileResult, Directory } from '@capacitor/filesystem';
import { Base64ImageOf } from 'src/app/modules/wallets/shared-wallets/models/base-64-image-of/base-64-image-of';

export class CachedAsset {
  constructor(
    private readonly base64ImageOf: Base64ImageOf,
    private readonly fileSystem: FilesystemPlugin,
    private readonly fileName?: string
  ) {}

  async value(): Promise<WriteFileResult> {
    return this.fileSystem.writeFile({
      directory: Directory.Cache,
      path: this.fileName ? this.fileName : this.getFileName(),
      data: await this.base64ImageOf.value(),
    });
  }

  private getFileName(): string {
    return new Date().getTime() + '.jpg';
  }
}
