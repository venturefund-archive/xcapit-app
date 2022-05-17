export class CustomValidatorErrors {
  static hasNumber = { hasNumber: true };

  static notChecked = { notChecked: true };

  static hasCapitalCase = { hasCapitalCase: true };
  
  static hasCapitalAndSmallCase = { hasCapitalAndSmallCase: true };

  static notAlphanumeric = { notAlphanumeric: true };

  static hasSmallCase = { hasSmallCase: true };

  static isNotInRange = { isNotInRange: true };

  static countWordsMatch = { countWordsMatch: true };

  static noPasswordMatch = { noPasswordMatch: true };

  static walletIncorrectPassword = { walletIncorrectPassword: true };

  static newPasswordMatchesOld = { newPasswordMatchesOld: true };

  static notNewPasswordMatchesOld = { newPasswordMatchesOld: false };

  static noFieldsMatch = { noFieldsMatch: true };

  static hasSpecialCharacter = { hasSpecialCharacter: true };

  static greaterThanError = { greaterThan: true };
}
