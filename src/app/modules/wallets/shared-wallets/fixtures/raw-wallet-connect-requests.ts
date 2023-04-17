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
};

export const rawSignTypedDataRequest = {
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
};
