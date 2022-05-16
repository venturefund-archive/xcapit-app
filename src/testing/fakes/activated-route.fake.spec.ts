import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Fake } from './fake.spec';

export class FakeActivatedRoute implements Fake {
  private readonly snapshotParams: any;
  private readonly snapshotQueryParams: any;
  private spy: jasmine.SpyObj<ActivatedRoute>;

  constructor(snapshotParams = null, snapshotQueryParams = null) {
    this.snapshotParams = snapshotParams;
    this.snapshotQueryParams = snapshotQueryParams;
  }

  createSpy(): any {
    this.spy = jasmine.createSpyObj('ActivatedRoute', [], ['snapshot']);
    this.modifySnapshotParams(this.snapshotParams, this.snapshotQueryParams);
    return this.spy;
  }

  modifyReturns() {}

  modifySnapshotParams(snapshotParams = null, snapshotQueryParams = null) {
    (Object.getOwnPropertyDescriptor(this.spy, 'snapshot').get as jasmine.Spy).and.returnValue(
      this.getSnapshotStructure(snapshotParams, snapshotQueryParams)
    );
  }

  getSnapshotStructure(snapshotParams, snapshotQueryParams) {
    return {
      paramMap: convertToParamMap(snapshotParams),
      queryParamMap: convertToParamMap(snapshotQueryParams),
    };
  }
}
