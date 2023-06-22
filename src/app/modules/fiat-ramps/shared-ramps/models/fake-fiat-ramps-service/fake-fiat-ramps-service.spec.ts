import { FakeFiatRampsService } from "./fake-fiat-ramps-service";

describe('FakeFiatRampsService', () => {

  let fakeFiatRampsService: FakeFiatRampsService;

  beforeEach(() => {
    fakeFiatRampsService = new FakeFiatRampsService();
  });

  it('new', () => {
    expect(fakeFiatRampsService).toBeTruthy();
  });

  it('getAddressByVoucher', () => {
    fakeFiatRampsService.getAddressByVoucher('anExternalCode').subscribe((res) => {
      expect(res).toEqual({ data: { to: 'asd' } });
    });
  });
})
