import { HttpHeaders } from "@angular/common/http";
import { BlobOf } from "src/app/shared/models/asset/blob-of/blob-of";

export class Base64ImageOf {
      constructor(private readonly _aLink : BlobOf, private readonly fileReader: FileReader) {}
  
      async value(){
        return new Promise(async (resolve, _) => {
          this.fileReader.onloadend = () => resolve(this.fileReader.result);
          this.fileReader.readAsDataURL(await this._aLink.value());
        });
      }
  }