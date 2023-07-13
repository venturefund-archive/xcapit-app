import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { LendersDataRepo } from '../data-repo/lenders-data-repo';
import { DefaultLenders } from '../default/default-lenders';
import { Lenders } from '../lenders.interface';

@Injectable({ providedIn: 'root' })
export class LendersInjectable {
  constructor(private remoteConfigService: RemoteConfigService, private translate: TranslateService) {}

  create(
    _aDataRepo: LendersDataRepo = new LendersDataRepo(this.remoteConfigService),
    _aTranslateService: TranslateService | FakeTranslateService = this.translate
  ): Lenders {
    return new DefaultLenders(_aDataRepo, _aTranslateService);
  }
}
