export default class RoundedNumber {
  constructor(private readonly aNumber: number, private readonly decimals: number = 2) {}

  public value(): number {
    const pow = Math.pow(10, this.decimals);
    return Math.round((this.aNumber + Number.EPSILON) * pow) / pow;
  }
}
