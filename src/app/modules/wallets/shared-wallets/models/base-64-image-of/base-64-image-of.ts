import { HttpHeaders } from "@angular/common/http";
import { BlobOf } from "src/app/shared/models/asset/blob-of/blob-of";

export class Base64ImageOf {
      constructor(private readonly _aLink : BlobOf, private readonly fileReader: FileReader) {}
  
      async value(): Promise<string>{
        return new Promise(async (resolve, reject) => {
          this.fileReader.onloadend = () => resolve(this.fileReader.result as string);
          this.fileReader.onerror = () => {
            reject('error');
          };
          this.fileReader.readAsDataURL(await this._aLink.value());
        });
      }
  }