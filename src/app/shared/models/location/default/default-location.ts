import { Location } from '../location.interface';

export default class DefaultLocation implements Location {
  href() {
    return window.location.href;
  }
}
