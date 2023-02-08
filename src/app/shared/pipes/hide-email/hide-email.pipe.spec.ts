import { HideEmailPipe } from "./hide-email.pipe";


describe('HideEmailPipe', () => {
  let pipe: HideEmailPipe;

  beforeEach(() => {
    pipe = new HideEmailPipe();
  });

  it('create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a new format', () => {
    const email = 'xcapit@test.com'
    expect(pipe.transform(email)).toEqual('xca...@test.com');
  });


});
