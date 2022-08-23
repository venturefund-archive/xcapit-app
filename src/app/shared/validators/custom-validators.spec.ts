import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { CustomValidatorErrors } from './custom-validator-errors';

let formBuilder: UntypedFormBuilder;

describe('CustomValidators', () => {
  beforeEach(() => {
    formBuilder = new UntypedFormBuilder();
  });

  it('should validate greater than', () => {
    const form: UntypedFormGroup = formBuilder.group({
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

  it('should validate Lower Than Equal', () => {
    const form: UntypedFormGroup = formBuilder.group({
      testLowerThanEqual: ['', [CustomValidators.lowerThanEqual(5)]],
    });

    form.patchValue({ testLowerThanEqual: 1 });
    expect(form.valid).toBe(true);
    expect(form.get('testLowerThanEqual').hasError('lowerThanEqual')).toBe(false);

    form.patchValue({ testLowerThanEqual: 5 });
    expect(form.valid).toBe(true);
    expect(form.get('testLowerThanEqual').hasError('lowerThanEqual')).toBe(false);

    form.patchValue({ testLowerThanEqual: 6 });
    expect(form.valid).toBe(false);
    expect(form.get('testLowerThanEqual').hasError('lowerThanEqual')).toBe(true);
  });

  it('should validate must be true', () => {
    const form: UntypedFormGroup = formBuilder.group({
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
    const form: UntypedFormGroup = formBuilder.group({
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
    const form: UntypedFormGroup = formBuilder.group(
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

  it('should validate address when is invalid', () => {
    const form: UntypedFormGroup = formBuilder.group({
      testIsAddress: ['', [CustomValidators.isAddress()]],
    });

    form.patchValue({ testIsAddress: 'asd' });
    expect(form.valid).toBe(false);
    expect(form.get('testIsAddress').hasError('isAddress')).toBe(true);
  });

  it('should validate address is valid', () => {
    const form: UntypedFormGroup = formBuilder.group({
      testIsAddress: ['', [CustomValidators.isAddress()]],
    });

    form.patchValue({ testIsAddress: '0x925F1b4d8092bd94608b1f680B87F87F0bd737DC' });
    expect(form.valid).toBe(true);
    expect(form.get('testIsAddress').hasError('isAddress')).toBe(false);
  });

  it('should validate that new password is different from old password', () => {
    const form: UntypedFormGroup = formBuilder.group(
      {
        old_password: ['', []],
        password: ['', []],
      },
      {
        validators: [CustomValidators.newPasswordEqualsOldValidator()],
      }
    );

    form.patchValue({ old_password: 'asd' });
    form.patchValue({ password: 'asd123' });
    expect(form.valid).toBe(true);
    expect(form.get('password').hasError('newPasswordMatchesOld')).toBe(false);

    form.patchValue({ old_password: 'asd' });
    form.patchValue({ password: 'asd' });
    expect(form.valid).toBe(false);
    expect(form.get('password').hasError('newPasswordMatchesOld')).toBe(true);
  });

  it('should validate pattern', () => {
    const form: UntypedFormGroup = formBuilder.group({
      testPattern: ['', [CustomValidators.patternValidator(/\d/, CustomValidatorErrors.hasNumber)]],
    });

    form.patchValue({ testPattern: 'asd' });
    expect(form.valid).toBe(false);
    expect(form.get('testPattern').hasError('hasNumber')).toBe(true);

    form.patchValue({ testPattern: '' });
    expect(form.valid).toBe(true);
    expect(form.get('testPattern').hasError('hasNumber')).toBe(false);

    form.patchValue({ testPattern: 123 });
    expect(form.valid).toBe(true);
    expect(form.get('testPattern').hasError('hasNumber')).toBe(false);
  });

  it('should fail empty validate pattern when failWhenEmpty is true',  () => {
    const form: UntypedFormGroup = formBuilder.group({
      testPattern: ['', [CustomValidators.patternValidator(/\d/, CustomValidatorErrors.hasNumber, true)]],
    });

    form.patchValue({ testPattern: '' });
    expect(form.valid).toBe(false);
    expect(form.get('testPattern').hasError('hasNumber')).toBe(true);
  });

  it('should validate that form control has no special characters', () => {
    const form: UntypedFormGroup = formBuilder.group({
      testPattern: ['', [CustomValidators.hasNoSpecialCharacters()]],
    });

    form.patchValue({ testPattern: 'asd' });
    expect(form.valid).toBe(true);
    expect(form.get('testPattern').hasError('hasSpecialCharacter')).toBe(false);

    form.patchValue({ testPattern: 'test test' });
    expect(form.valid).toBe(true);
    expect(form.get('testPattern').hasError('hasSpecialCharacter')).toBe(false);

    form.patchValue({ testPattern: '' });
    expect(form.valid).toBe(true);
    expect(form.get('testPattern').hasError('hasSpecialCharacter')).toBe(false);

    form.patchValue({ testPattern: ' ' });
    expect(form.valid).toBe(true);
    expect(form.get('testPattern').hasError('hasSpecialCharacter')).toBe(false);

    form.patchValue({ testPattern: 'test123' });
    expect(form.valid).toBe(false);
    expect(form.get('testPattern').hasError('hasSpecialCharacter')).toBe(true);

    form.patchValue({ testPattern: 'te$t' });
    expect(form.valid).toBe(false);
    expect(form.get('testPattern').hasError('hasSpecialCharacter')).toBe(true);

    form.patchValue({ testPattern: 'tes/t, ' });
    expect(form.valid).toBe(false);
    expect(form.get('testPattern').hasError('hasSpecialCharacter')).toBe(true);

    form.patchValue({ testPattern: '$' });
    expect(form.valid).toBe(false);
    expect(form.get('testPattern').hasError('hasSpecialCharacter')).toBe(true);
  });

  it('should validate advanced word count', () => {
    const form: UntypedFormGroup = formBuilder.group({
      testPattern: ['', [CustomValidators.advancedCountWords(3)]],
    });

    form.patchValue({ testPattern: 'one two three' });
    expect(form.valid).toBe(true);
    expect(form.get('testPattern').hasError('countWordsMatch')).toBe(false);

    form.patchValue({ testPattern: 'one, two, three' });
    expect(form.valid).toBe(true);
    expect(form.get('testPattern').hasError('countWordsMatch')).toBe(false);

    form.patchValue({ testPattern: 'one-two-three' });
    expect(form.valid).toBe(true);
    expect(form.get('testPattern').hasError('countWordsMatch')).toBe(false);

    form.patchValue({ testPattern: 'one/two/three/ -' });
    expect(form.valid).toBe(true);
    expect(form.get('testPattern').hasError('countWordsMatch')).toBe(false);

    form.patchValue({ testPattern: 'word1/word2 - word3' });
    expect(form.valid).toBe(true);
    expect(form.get('testPattern').hasError('countWordsMatch')).toBe(false);

    form.patchValue({ testPattern: 'one two' });
    expect(form.valid).toBe(false);
    expect(form.get('testPattern').hasError('countWordsMatch')).toBe(true);

    form.patchValue({ testPattern: 'one/two/three/four' });
    expect(form.valid).toBe(false);
    expect(form.get('testPattern').hasError('countWordsMatch')).toBe(true);

    form.patchValue({ testPattern: '' });
    expect(form.valid).toBe(false);
    expect(form.get('testPattern').hasError('countWordsMatch')).toBe(true);

    form.patchValue({ testPattern: ' ' });
    expect(form.valid).toBe(false);
    expect(form.get('testPattern').hasError('countWordsMatch')).toBe(true);

    form.patchValue({ testPattern: '$' });
    expect(form.valid).toBe(false);
    expect(form.get('testPattern').hasError('countWordsMatch')).toBe(true);
  });
});
