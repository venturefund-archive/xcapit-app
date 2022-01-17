import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Fake } from './fake.spec';

export class FakeActivatedRoute implements Fake {
  private readonly snapshotParams: any;
  private spy: jasmine.SpyObj<ActivatedRoute>;

  constructor(snapshotParams = null) {
    this.snapshotParams = snapshotParams;
  }

  createSpy(): any {
    this.spy = jasmine.createSpyObj('ActivatedRoute', [], ['snapshot']);
    this.modifySnapshotParams(this.snapshotParams);
    return this.spy;
  }

  modifyReturns() {}

  modifySnapshotParams(snapshotParams) {
    (Object.getOwnPropertyDescriptor(this.spy, 'snapshot').get as jasmine.Spy).and.returnValue(
      this.getSnapshotStructure(snapshotParams)
    );
  }

  getSnapshotStructure(snapshotParams) {
    return {
      paramMap: convertToParamMap(snapshotParams),
    };
  }
}
