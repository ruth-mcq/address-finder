import { TomTomApiClient } from "./maps-api";
import { Address } from "./model";

/**
 * @param {string}  address - The partial address.
 * @param {number} [limit=100] - The number of results to return.
 * @param {number} [offset=0] - The number of results to skip.
 * @returns {address[]} The list of address results.
 */
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
