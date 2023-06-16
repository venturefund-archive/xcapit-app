export const CONFIRMATION_CONTENT = {
  front_id: {
    progress:0.25,
    title: 'fiat_ramps.shared.confirmation_content.front_id.title',
    items: 'fiat_ramps.shared.confirmation_content.front_id.items',
    button_primary:"fiat_ramps.shared.confirmation_content.front_id.button_primary",
    button_secondary:"fiat_ramps.shared.confirmation_content.front_id.button_secondary",
    nextPageUrl:'/fiat-ramps/kyc/validation/back_id',
    documentName: 'front_document'
  },
  back_id: {
    progress:0.5,
    title: 'fiat_ramps.shared.confirmation_content.back_id.title',
    items: 'fiat_ramps.shared.confirmation_content.back_id.items',
    button_primary:"fiat_ramps.shared.confirmation_content.back_id.button_primary",
    button_secondary:"fiat_ramps.shared.confirmation_content.back_id.button_secondary",
    nextPageUrl:'/fiat-ramps/kyc/validation/dni_selfie',
    documentName:'back_document'
  },
  dni_selfie: {
    progress:1,
    title: 'fiat_ramps.shared.confirmation_content.dni_selfie.title',
    items: 'fiat_ramps.shared.confirmation_content.dni_selfie.items',
    button_primary:"fiat_ramps.shared.confirmation_content.dni_selfie.button_primary",
    button_secondary:"fiat_ramps.shared.confirmation_content.dni_selfie.button_secondary",
    nextPageUrl:'/fiat-ramps/purchases',
    documentName:'dni_selfie'
  }
};
