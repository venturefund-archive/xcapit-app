import { Verify } from '@walletconnect/types';

export const verifyContext: Verify.Context = {
  verified: {
    verifyUrl: 'https://verify.walletconnect.com',
    validation: 'VALID',
    origin: 'https://react-app.walletconnect.com',
    isScam: null,
  },
};
export const rawPersonalSignRequest = {
  id: 1678769188353444,
  topic: '3c313ca339e75929727a23edf97dacebffad238a8ca33bc866d0bb2bb5d032ec',
  params: {
    request: {
      method: 'personal_sign',
      params: [
        '0x4d7920656d61696c206973206a6f686e40646f652e636f6d202d2031363738373639313838333439',
        '0x2e5dc8d771e8b0889d421c0649997a5ae263cb58',
      ],
    },
    chainId: 'eip155:80001',
  },
  verifyContext: verifyContext,
};

export const rawEthSignRequest = {
  id: 1678822854606621,
  topic: 'ffce4e4ad40015694805cc7a2384b93e5433eb2a05a5684e0589c1f6ce0d1ecd',
  params: {
    request: {
      method: 'eth_sign',
      params: [
        '0x2e5dc8d771e8b0889d421c0649997a5ae263cb58',
        '0x4d7920656d61696c206973206a6f686e40646f652e636f6d202d2031363738383232383534363034',
      ],
    },
    chainId: 'eip155:80001',
  },
  verifyContext: verifyContext,
};

export const rawSendTransactionRequestDefault = {
  id: 1680621651042152,
  topic: '15a430a13a6af8ce64a1f556ee24912b2774b5e8d33b457419ebe088d4c20d8d',
  params: {
    request: {
      method: 'eth_sendTransaction',
      params: [
        {
          from: '0xcf8c0b1212d7eee3fff6d868cb7c86a97dc19a56',
          to: '0xcf8c0b1212d7eee3fff6d868cb7c86a97dc19a56',
          data: '0x',
          nonce: '0x93',
          gasPrice: '0x33f29d8041',
          gasLimit: '0x5208',
          value: '0x00',
        },
      ],
    },
    chainId: 'eip155:137',
  },
  verifyContext: verifyContext,
};

export const rawSwapTransactionRequest = {
  id: 1680621651042152,
  topic: '15a430a13a6af8ce64a1f556ee24912b2774b5e8d33b457419ebe088d4c20d8d',
  params: {
    request: {
      method: 'eth_sendTransaction',
      params: [
        {
          data: '0x8803dbee000000000000000000000000000000000000000000000000000041c1dfeeb74100000000000000000000000000000000000000000000000017cfae1d842fe7cb00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000009c7314d0745bf0df80040dabd6ce87efcc5969e8000000000000000000000000000000000000000000000000000000006283f1ff000000000000000000000000000000000000000000000000000000000000000300000000000000000000000019f64674d8a5b4e652319f5e239efd3bc969a1fe00000000000000000000000009b6ca5e4496238a1f176aea6bb607db96c2286e0000000000000000000000004da7997a819bb46b6758b9102234c289dd2ad3bf',
          from: '0x9c7314d0745bf0df80040dabd6ce87efcc5969e8',
          gas: '0x3762c',
          gasPrice: '0x3e252e0',
          gasLimit: '0x5208',
          to: '0xf55c496bb1058690db1401c4b9c19f3f44374961',
        },
      ],
    },
    chainId: 'eip155:137',
  },
  verifyContext: verifyContext,
};

export const rawApproveTransactionRequest = {
  id: 1680621651042152,
  topic: '15a430a13a6af8ce64a1f556ee24912b2774b5e8d33b457419ebe088d4c20d8d',
  params: {
    request: {
      method: 'eth_sendTransaction',
      params: [
        {
          data: '0x095ea7b3000000000000000000000000f55c496bb1058690db1401c4b9c19f3f44374961ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
          from: '0x9c7314d0745bf0df80040dabd6ce87efcc5969e8',
          gas: '0xcd71',
          gasPrice: '0x3e252e0',
          gasLimit: '0x5208',
          to: '0x4da7997a819bb46b6758b9102234c289dd2ad3bf',
        },
      ],
    },
    chainId: 'eip155:137',
  },
  verifyContext: verifyContext,
};

export const rawSignTypedDataRequest = {
  verified: {
    origin: 'someOrigin',
    validation: 'VALID',
    verifyUrl: 'someVerifyUrl',
    isScam: false,
  },
  id: 1681236104977555,
  topic: 'c1e7a3c687b70d06c114be46d08e279be355c814c4614dc049d20dc7257e1782',
  params: {
    request: {
      method: 'eth_signTypedData',
      params: [
        '0x917686f79e211c24b8426d169fb77161fbe20b07',
        '{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Person":[{"name":"name","type":"string"},{"name":"wallet","type":"address"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person"},{"name":"contents","type":"string"}]},"primaryType":"Mail","domain":{"name":"Ether Mail","version":"1","chainId":1,"verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"},"message":{"from":{"name":"Cow","wallet":"0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"},"to":{"name":"Bob","wallet":"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},"contents":"Hello, Bob!"}}',
      ],
    },
    chainId: 'eip155:80001',
  },
  verifyContext: verifyContext,
};

export const rawSignTransactionRequestDefault = {
  id: 1681744470654406,
  topic: '1f0d642c24c673a36d14057243ef0a72b4c609bd7b5a0b86b21df2e3a53534ea',
  params: {
    request: {
      method: 'eth_signTransaction',
      params: [
        {
          from: '0x917686f79e211c24b8426d169fb77161fbe20b07',
          to: '0x917686f79e211c24b8426d169fb77161fbe20b07',
          data: '0x',
          nonce: '0x00',
          gasPrice: '0x9502f90f',
          gasLimit: '0x5208',
          value: '0x00',
        },
      ],
    },
    chainId: 'eip155:80001',
  },
  verifyContext: verifyContext,
};
