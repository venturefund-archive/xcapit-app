import { TranslateService } from '@ngx-translate/core';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { DefaultLender } from '../../lender/default/default-lender';
import { Lender } from '../../lender/lender.interface';
import { LendersDataRepo } from '../data-repo/lenders-data-repo';
import { Lenders } from '../lenders.interface';
import { NullLender } from '../../lender/null/null-lender';

export class DefaultLenders implements Lenders {
  constructor(
    private readonly _aDataRepo: LendersDataRepo,
    private readonly _aTranslateService: TranslateService | FakeTranslateService
  ) {}

  public oneByName(aName: string): Lender {
    return this._aDataRepo.oneByName(aName) ?
      new DefaultLender(this._aDataRepo.oneByName(aName), this._aTranslateService) :
      new NullLender();
  }
}
