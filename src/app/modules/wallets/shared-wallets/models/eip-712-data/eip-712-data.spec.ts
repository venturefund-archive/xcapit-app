import { EIP712Data } from "./eip-712-data";
import { rawEIP712Data } from "../../fixtures/raw-eip-712-data";


describe('EIP712Data', () => {
  let data: EIP712Data;

  beforeEach(() => {
    data = new EIP712Data(rawEIP712Data);
  });

  it('new', () => {
    expect(data).toBeTruthy();
  });

  it('valid for a chain id', () => {
    expect(data.validFor(data.chainId())).toBeTrue();
  });

  it('not valid for a chain id', () => {
    expect(data.validFor(5)).toBeFalse();
  });

  it('to JSON', () => {
    expect(JSON.stringify(data.toJSON())).toEqual(rawEIP712Data);
  });
});
