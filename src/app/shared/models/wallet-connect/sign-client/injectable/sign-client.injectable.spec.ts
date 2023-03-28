import { EnvService } from 'src/app/shared/services/env/env.service';
import { SignClientInjectable } from './sign-client.injectable';
import { SignClientV2 } from '../sign-client';

describe('SignClientInjectable', () => {
  let envServiceSpy: jasmine.SpyObj<EnvService>;
  let signClientV2ClassSpy: jasmine.SpyObj<typeof SignClientV2>;
  let signClientV2InstanceSpy: jasmine.SpyObj<SignClientV2>;

  beforeEach(() => {
    signClientV2InstanceSpy = jasmine.createSpyObj('SignClientV2', {
      removeEventListener: null,
    });
    signClientV2ClassSpy = jasmine.createSpyObj('SignClientV2', {
      create: Promise.resolve(signClientV2InstanceSpy),
    });
  });

  it('new', () => {
    expect(new SignClientInjectable(envServiceSpy)).toBeTruthy();
  });

  it('signClient must create a sign client instance if not exists and return it', async () => {
    expect(await new SignClientInjectable(envServiceSpy).create(signClientV2ClassSpy)).toEqual(signClientV2InstanceSpy);
  });

  it('signClient must return an existing sign client', async () => {
    const signClientInjectable = new SignClientInjectable(envServiceSpy);
    signClientInjectable._signClient = signClientV2InstanceSpy;
    expect(await signClientInjectable.create()).toEqual(signClientV2InstanceSpy);
  });
});
