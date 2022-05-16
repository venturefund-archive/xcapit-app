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
    return Math.min(Math.max(this.totalDigits - this.entireQuantity(), 0), this.maxDecimals);
  }

  public asString(): string {
    let result = this.value().toString();

    if (result.includes('e')) {
      result = parseFloat(result).toFixed(this.decimals());
    }

    if (result.includes('.')) {
      result = result.replace(/\.?0+$/, '');
    }

    return result;
  }

  public value(): number {
    return parseFloat(this.aNumber.toFixed(this.decimals()));
  }
}
