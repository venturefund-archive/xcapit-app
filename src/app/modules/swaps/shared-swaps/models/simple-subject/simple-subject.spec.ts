import { SimpleSubject } from "./simple-subject";


describe('Simple Subject', () => {

  const expectedResult = 1;
  let subject: SimpleSubject;

  beforeEach(() => {
    subject = new SimpleSubject();
  });

  it('new', () => {
    expect(new SimpleSubject()).toBeTruthy();
  });

  it('subscribe', () => {
    subject.subscribe(() => true);

    expect(true).toBeTrue();
  });

  it('notify', async () => {
    subject.subscribe(() => expectedResult);

    expect(await subject.notify()).toEqual(expectedResult);
  });

  it('notify with async subscriber', async () => {
    subject.subscribe(() => Promise.resolve(expectedResult));

    expect(await subject.notify()).toEqual(expectedResult);
  });

  it('notify with default async subscriber', async () => {
    expect(await subject.notify()).toEqual(false);
  });
});
