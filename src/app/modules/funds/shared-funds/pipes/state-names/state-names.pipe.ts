import { Pipe, PipeTransform } from '@angular/core';
import { StateNamesService } from 'src/app/shared/services/state-names/state-names.service';

/**
 * Pipe que acepta el estado del servidor y devuelve el nombre parar mostrar, :
 */
@Pipe({
  name: 'stateShowName'
})
export class StateShowNamePipe implements PipeTransform {
  constructor(private stateNamesService: StateNamesService) {}
  transform(value: string): string {
    return this.stateNamesService.getStateShowName(value);
  }
}
