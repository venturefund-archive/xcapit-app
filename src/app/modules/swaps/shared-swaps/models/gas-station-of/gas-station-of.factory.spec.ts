import { Injectable } from "@angular/core";


@Injectable({ providedIn: 'root' })
export class GasStationOfFactory {

  create() {
    return true;
  }
}


fdescribe('GasStationOfFactory', () => {

  it('new', () => {
    expect(false).toBeTruthy();
  });

  it('create', () => {
    expect(false).toBeTruthy();
  });
});
