import { Lender } from '../lender/lender.interface';

export interface Lenders {
  oneByName(aName: string): Lender;
}
