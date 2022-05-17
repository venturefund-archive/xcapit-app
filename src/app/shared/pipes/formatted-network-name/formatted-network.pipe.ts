import { Pipe, PipeTransform } from '@angular/core';
import { NETWORK_NAMES } from '../../constants/network-names.constant';

@Pipe({
  name: 'formattedNetwork',
})
export class FormattedNetworkPipe implements PipeTransform {
  transform(value: string): string {
    return NETWORK_NAMES.hasOwnProperty(value) ? NETWORK_NAMES[value] : value;
  }
}
