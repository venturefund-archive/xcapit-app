import { RequestMessage } from '../request-message.interface';

export class NullRequestMessage implements RequestMessage {
  constructor() {}

  value(): HTMLElement {
    return undefined;
  }
}
