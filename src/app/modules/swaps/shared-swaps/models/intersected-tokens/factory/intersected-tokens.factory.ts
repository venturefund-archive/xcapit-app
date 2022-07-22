import { Injectable } from '@angular/core';
import { Tokens } from '../../tokens/tokens';
import { IntersectedTokens } from '../intersected-tokens';

@Injectable({ providedIn: 'root' })
export class IntersectedTokensFactory {
  public create(_groupA: Tokens, _groupB: Tokens): Tokens {
    return new IntersectedTokens(_groupA, _groupB);
  }
}
