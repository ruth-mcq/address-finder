import { Address } from "./model";

export interface IMapApi {
  getPlaceAutocomplete: (
    address: string,
    limit: number,
    offset: number,
  ) => Promise<Address[]>;
}
