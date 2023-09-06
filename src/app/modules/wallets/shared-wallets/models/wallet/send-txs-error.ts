export class SendTxsError extends Error {
  constructor(message: string, private url: string) {
    super(message);
    this.url = url;
  }
}
