export abstract class Fake {
  abstract createSpy(...args): any;
  abstract modifyReturns(...args): void;
}
