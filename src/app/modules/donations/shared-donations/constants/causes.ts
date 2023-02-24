import { environment } from 'src/environments/environment';

export const CAUSES = [
  {
    id: 'unicef',
    scope: 'donations.description_cause.info.global',
    image: 'assets/img/donations/causes/cause_7/image.png',
    title: 'UNICEF',
    logo: 'assets/img/donations/causes/cause_7/logo.svg',
    type: 'human_rights',
    title_1: 'donations.description_cause.info.unicef.title_1',
    title_2: 'donations.description_cause.info.unicef.title_2',
    title_3: 'donations.description_cause.info.unicef.title_3',
    description: 'donations.description_cause.info.unicef.description',
    addresses: [
      {
        address: '0xdE7Bb4FAEFfABef07dece6DC7118aE77e7743649',
        token: { network: 'ERC20', value: 'ETH' },
      },
    ],
    social_media: [
      { logo: 'instagram', link: 'https://www.instagram.com/uniceflac/', text: 'instagram.com/uniceflac' },
      { logo: 'twitter', link: 'https://twitter.com/uniceflac', text: 'twitter.com/uniceflac' },
      { logo: 'mail', link: 'https://www.unicef.org.au/contact-us', text: 'unicef.org.au/contact-us' },
    ],
  },
  {
    id: 'caecus',
    scope: 'donations.description_cause.info.latam',
    image: 'assets/img/donations/causes/cause_8/image.png',
    title: 'Caecus',
    logo: 'assets/img/donations/causes/cause_8/logo.svg',
    type: 'social',
    title_1: 'donations.description_cause.info.caecus.title_1',
    title_2: 'donations.description_cause.info.caecus.title_2',
    title_3: 'donations.description_cause.info.caecus.title_3',
    description: 'donations.description_cause.info.caecus.description',
    addresses: [
      {
        address: '0x9065f88e288b4cacb1c80282a3dc0ade121e08ef',
        token: { network: 'ERC20', value: 'ETH' },
      },
    ],
    social_media: [
      { logo: 'instagram', link: 'https://www.instagram.com/caecuslab', text: 'instagram.com/caecuslab' },
      {
        logo: 'linkedin',
        link: 'https://www.linkedin.com/company/caecus-lab',
        text: 'linkedin.com/company/caecus-lab',
      },
      { logo: 'mail', link: 'http://caecuslab.com', text: 'info@caecuslab.com' },
    ],
  },
  {
    id: 'unhcr',
    scope: 'donations.description_cause.info.global',
    image: 'assets/img/donations/causes/cause_1/image.jpg',
    title: 'UNHCR',
    logo: 'assets/img/donations/causes/cause_1/logo.svg',
    type: 'humanitary',
    title_1: 'donations.description_cause.info.unhcr.title_1',
    title_2: 'donations.description_cause.info.unhcr.title_2',
    title_3: 'donations.description_cause.info.unhcr.title_3',
    description: 'donations.description_cause.info.unhcr.description',
    addresses: [
      {
        address: '0xFaB6d79902329D7f3242060bb7E6cd2c59E9fA66',
        token: { network: 'ERC20', value: 'ETH' },
      },
    ],
    social_media: [
      { logo: 'instagram', link: 'https://instagram.com/acnur', text: 'instagram.com/acnur' },
      { logo: 'twitter', link: 'https://twitter.com/ACNURamericas', text: 'twitter.com/ACNURamericas' },
      { logo: 'mail', link: 'https://argbu@unhcr.org', text: 'argbu@unhcr.org' },
    ],
  },
  {
    id: 'freethegirls',
    scope: 'donations.description_cause.info.global',
    image: 'assets/img/donations/causes/cause_2/image.jpg',
    title: 'Free the Girls',
    logo: 'assets/img/donations/causes/cause_2/logo.jpg',
    type: 'human_rights',
    title_1: 'donations.description_cause.info.free_the_girls.title_1',
    title_2: 'donations.description_cause.info.free_the_girls.title_2',
    title_3: 'donations.description_cause.info.free_the_girls.title_3',
    description: 'donations.description_cause.info.free_the_girls.description',
    addresses: [
      {
        address: '0xb8d10415466260c9108a00Dad4b92F411365DB81',
        token: { network: 'ERC20', value: 'ETH' },
      },
    ],
    social_media: [
      { logo: 'instagram', link: 'https://instagram.com/freethegirlsbras', text: 'instagram.com/freethegirlsbras' },
      { logo: 'twitter', link: 'https://twitter.com/freethegirls', text: 'twitter.com/freethegirls' },
      { logo: 'mail', link: 'https://info@rainforestrescue.org.au', text: 'info@rainforestrescue.org.au' },
    ],
  },
  {
    id: 'rainforestrescue',
    scope: 'donations.description_cause.info.global',
    image: 'assets/img/donations/causes/cause_3/image.jpg',
    title: 'Rainforest rescue',
    logo: 'assets/img/donations/causes/cause_3/logo.svg',
    type: 'environment',
    title_1: 'donations.description_cause.info.rainforest_rescue.title_1',
    title_2: 'donations.description_cause.info.rainforest_rescue.title_2',
    title_3: 'donations.description_cause.info.rainforest_rescue.title_3',
    description: 'donations.description_cause.info.rainforest_rescue.description',
    addresses: [
      {
        address: '0x58F80A92e9c74eBf98aC40397DE505a71f9aAfa6',
        token: { network: 'ERC20', value: 'ETH' },
      },
    ],
    social_media: [
      { logo: 'instagram', link: 'https://instagram.com/rainforestrescueau', text: 'instagram.com/rainforestrescueau' },
      { logo: 'youtube', link: 'https://youtube.com/Rainforest Rescue', text: 'youtube.com/Rainforest Rescue' },
      { logo: 'mail', link: 'https://info@rainforestrescue.org.au', text: 'info@rainforestrescue.org.au' },
    ],
  },
  {
    id: 'water',
    scope: 'donations.description_cause.info.global',
    image: 'assets/img/donations/causes/cause_4/image.jpg',
    title: 'Water.org',
    logo: 'assets/img/donations/causes/cause_4/logo.jpg',
    type: 'humanitary',
    title_1: 'donations.description_cause.info.water.title_1',
    title_2: 'donations.description_cause.info.water.title_2',
    title_3: 'donations.description_cause.info.water.title_3',
    description: 'donations.description_cause.info.water.description',
    addresses: [
      {
        address: '0x26B958BB6fa7B606F93d719779B72f659F610f8C',
        token: { network: 'ERC20', value: 'ETH' },
      },
    ],
    social_media: [
      { logo: 'instagram', link: 'https://instagram.com/water', text: 'instagram.com/water' },
      { logo: 'twitter', link: 'https://twitter.com/water', text: 'twitter.com/water' },
      { logo: 'mail', link: 'https://water.org/contact-us', text: 'water.org/contact-us' },
    ],
  },
  {
    id: 'proofofintegrity',
    scope: 'donations.description_cause.info.regional',
    image: 'assets/img/donations/causes/cause_5/image.jpg',
    title: 'Proof of integrity',
    logo: 'assets/img/donations/causes/cause_5/logo.svg',
    type: 'humanitary',
    title_1: 'donations.description_cause.info.proof_of_integrity.title_1',
    title_2: 'donations.description_cause.info.proof_of_integrity.title_2',
    title_3: 'donations.description_cause.info.proof_of_integrity.title_3',
    description: 'donations.description_cause.info.proof_of_integrity.description',
    addresses: [
      {
        address: '0x75DeD588d2a4734D0a61B9953A3C4e6C6D00AbC4',
        token: { network: 'ERC20', value: 'ETH' },
      },
    ],
    social_media: [
      { logo: 'instagram', link: 'https://instagram.com/proofofintegrity', text: 'instagram.com/proofofintegrity' },
      { logo: 'twitter', link: 'https:/twitter.com/proof_integrity', text: 'twitter.com/proof_integrity' },
      { logo: 'mail', link: 'https://info@proofofintegrity.org', text: 'info@proofofintegrity.org' },
    ],
  },
  {
    id: 'pulenta',
    scope: 'donations.description_cause.info.regional',
    image: 'assets/img/donations/causes/cause_6/image.jpg',
    title: 'Pulenta',
    logo: 'assets/img/donations/causes/cause_6/logo.svg',
    type: 'humanitary',
    title_1: 'donations.description_cause.info.pulenta.title_1',
    title_2: 'donations.description_cause.info.pulenta.title_2',
    title_3: 'donations.description_cause.info.pulenta.title_3',
    description: 'donations.description_cause.info.pulenta.description',
    addresses: [
      {
        address: '0x5e2d6c38e0bc700b15b74fd994b2277d4b11bb65',
        token: {
          network: 'MATIC',
          value: 'USDC',
        },
      },
      {
        address: '0xFf71962B9173Ac79101a91614fe6a0D01F3168b5',
        token: {
          network: 'ERC20',
          value: 'USDC',
        },
      },
    ],
    social_media: [{ logo: 'chain', link: 'https://pulenta.org', text: 'pulenta.org/' }],
  },
];
