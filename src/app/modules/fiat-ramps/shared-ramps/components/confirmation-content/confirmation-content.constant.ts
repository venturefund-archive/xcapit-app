export const CONFIRMATION_CONTENT = {
  front_id: {
    stepFrom: 1,
    progress:0.25,
    title: 'fiat_ramps.shared.confirmation_content.front_id.title',
    subtitle: 'fiat_ramps.shared.confirmation_content.front_id.subtitle',
    items: 'fiat_ramps.shared.confirmation_content.front_id.items',
    nextPageUrl:'/fiat-ramps/kyc/validation/back_id',
    documentName: 'front_document'
  },
  back_id: {
    stepFrom: 2,
    progress:0.5,
    title: 'fiat_ramps.shared.confirmation_content.back_id.title',
    subtitle: 'fiat_ramps.shared.confirmation_content.back_id.subtitle',
    items: 'fiat_ramps.shared.confirmation_content.back_id.items',
    nextPageUrl:'',
    documentName:'back_document'
  }
};
