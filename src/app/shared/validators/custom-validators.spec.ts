import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { CustomValidatorErrors } from './custom-validator-errors';

let formBuilder: FormBuilder;

describe('AmountInputCardComponent', () => {
  beforeEach(() => {
    formBuilder = new FormBuilder();
  });

  it('should validate greater than', () => {
    const form: FormGroup = formBuilder.group({
      testGreaterThan: ['', [CustomValidators.greaterThan(5)]],
    });

    form.patchValue({ testGreaterThan: 1 });
    expect(form.valid).toBe(false);
    expect(form.get('testGreaterThan').hasError('greaterThan')).toBe(true);

    form.patchValue({ testGreaterThan: 5 });
    expect(form.valid).toBe(false);
    expect(form.get('testGreaterThan').hasError('greaterThan')).toBe(true);

    form.patchValue({ testGreaterThan: 6 });
    expect(form.valid).toBe(true);
    expect(form.get('testGreaterThan').hasError('greaterThan')).toBe(false);
  });

  it('should validate must be true', () => {
    const form: FormGroup = formBuilder.group({
      testMustBeTrue: ['', [CustomValidators.mustBeTrue]],
    });

    form.patchValue({ testMustBeTrue: false });
    expect(form.valid).toBe(false);
    expect(form.get('testMustBeTrue').hasError('notChecked')).toBe(true);

    form.patchValue({ testMustBeTrue: true });
    expect(form.valid).toBe(true);
    expect(form.get('testMustBeTrue').hasError('notChecked')).toBe(false);
  });

  it('should validate count words', () => {
    const form: FormGroup = formBuilder.group({
      testCountWords: ['', [CustomValidators.countWords(12)]],
    });

    form.patchValue({ testCountWords: 'asd' });
    expect(form.valid).toBe(false);
    expect(form.get('testCountWords').hasError('countWordsMatch')).toBe(true);

    form.patchValue({ testCountWords: 'asd asd asd asd asd asd asd asd asd asd asd asd' });
    expect(form.valid).toBe(true);
    expect(form.get('testCountWords').hasError('countWordsMatch')).toBe(false);

    form.patchValue({ testCountWords: 'asd  asd asd  asd asd asd asd asd    asd asd asd asd' });
    expect(form.valid).toBe(true);
    expect(form.get('testCountWords').hasError('countWordsMatch')).toBe(false);
  });

  it('should validate password match', () => {
    const form: FormGroup = formBuilder.group(
      {
        password: ['', []],
        repeat_password: ['', []],
      },
      {
        validators: [CustomValidators.passwordMatchValidator],
      }
    );

    form.patchValue({ password: 'asd' });
    form.patchValue({ repeat_password: 'asd123' });
    expect(form.valid).toBe(false);
    expect(form.get('repeat_password').hasError('noPasswordMatch')).toBe(true);

    form.patchValue({ password: 'asd' });
    form.patchValue({ repeat_password: 'asd' });
    expect(form.valid).toBe(true);
    expect(form.get('repeat_password').hasError('noPasswordMatch')).toBe(false);
  });

  it('should validate pattern', () => {
    const form: FormGroup = formBuilder.group({
      testPattern: ['', [CustomValidators.patternValidator(/\d/, CustomValidatorErrors.hasNumber)]],
    });

    form.patchValue({ testPattern: 'asd' });
    expect(form.valid).toBe(false);
    expect(form.get('testPattern').hasError('hasNumber')).toBe(true);

    form.patchValue({ testPattern: 123 });
    expect(form.valid).toBe(true);
    expect(form.get('testPattern').hasError('hasNumber')).toBe(false);
  });
});
