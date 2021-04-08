import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Pipe({
  name: 'hideText',
  pure: false,
})
export class HideTextPipe implements PipeTransform {
  public activated: boolean ;

  constructor(private localStorageService: LocalStorageService) {
    this.activated = this.localStorageService.getHideFunds()

  }

  

  activate() {
    this.activated = true;
    this.transform;
  }

  desactivate() {
    this.activated = false;
    this.transform;
  }

  transform(value: string, activated : boolean): string {
    if ((this.activated === true)) {
      console.log("me estoy activando")
      return value ? value.replace(value, '****') : value ;
    } else {
      return value;
    }
  }
}
