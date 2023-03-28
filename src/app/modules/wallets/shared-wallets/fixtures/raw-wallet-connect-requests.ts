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
