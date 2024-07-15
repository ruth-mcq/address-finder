import { TomTomApiClient } from "./maps-api";
import { Address } from "./model";

export async function getAutoCompleteDetails(
  address: string,
  limit: number = 100,
  offset: number = 0,
): Promise<Address[]> {
  const client = new TomTomApiClient(process.env.TOMTOM_API_KEY ?? "");
  // get autocomplete results
  const res = client.getPlaceAutocomplete(address, limit, offset);

  return res;
}
