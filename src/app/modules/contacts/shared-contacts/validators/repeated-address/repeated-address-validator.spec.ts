import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { RepeatedAddressValidator } from './repeated-address-validator';

describe('RepeatedAddressValidator', () => {
  const contacts = [
    {
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      name: 'TestWallet',
      networks: ['ERC20', 'RSK'],
    },
  ];

  let repeatedAddressValidator: RepeatedAddressValidator;
  let formBuilder: UntypedFormBuilder;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(() => {
    formBuilder = new UntypedFormBuilder();
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(contacts),
    });
    TestBed.configureTestingModule({
      providers: [{ provide: IonicStorageService, useValue: ionicStorageServiceSpy }],
    });
    repeatedAddressValidator = TestBed.inject(RepeatedAddressValidator);
  });

  it('should be created', () => {
    expect(repeatedAddressValidator).toBeTruthy();
  });

  it('should be invalid form when address is already saved on storage', fakeAsync(() => {
    const form: UntypedFormGroup = formBuilder.group({
      address: ['', [], [repeatedAddressValidator.validate]],
    });

    form.patchValue({ address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' });
    form.updateValueAndValidity();
    tick();

    expect(form.valid).toBe(false);
    expect(form.get('address').hasError('isRepeatedAddress')).toBe(true);
  }));

  it('should be valid form when address is not already saved on storage', fakeAsync(() => {
    const form: UntypedFormGroup = formBuilder.group({
      address: ['', [], [repeatedAddressValidator.validate]],
    });

    form.patchValue({ address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef' });
    form.updateValueAndValidity();
    tick();

    expect(form.valid).toBe(true);
    expect(form.get('address').hasError('isRepeatedAddress')).toBe(false);
  }));
});
