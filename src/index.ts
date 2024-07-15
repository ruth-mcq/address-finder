import { getPlaceAutocomplete } from "./maps-api";
import { Address, MapApiResult } from "./model";

export async function getAutoCompleteDetails(
  address: string,
  limit: number = 100,
  offset: number = 0,
): Promise<Address[]> {
  const apiKey = process.env.TOMTOM_API_KEY ?? "";
  // get autocomplete results
  const res = getPlaceAutocomplete(apiKey, address, limit, offset).then(
    async (autocompleteResults) => {
      // loop over and get details and map results
      return autocompleteResults.map((result: MapApiResult) => {
        const address: Address = {
          placeId: result.id,
          ...result.address,
        };
        return address;
      });
    },
  );
  return res;
}
