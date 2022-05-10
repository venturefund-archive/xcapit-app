export class FormattedAmount {
  constructor(
    private readonly aNumber: number,
    private readonly totalDigits: number = 14,
    private readonly maxDecimals: number = 8
  ) {}

  private entireQuantity(): number {
    return this.aNumber.toString().split('.')[0].length;
  }

  private decimals(): number {
    return Math.min(this.totalDigits - this.entireQuantity(), this.maxDecimals);
  }

  public value(): number {
    return parseFloat(this.aNumber.toFixed(this.decimals()));
  }
}
