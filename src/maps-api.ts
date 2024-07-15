import axios, { AxiosError } from "axios";
import { MapApiResult } from "./model";

// https://developer.tomtom.com/search-api/documentation/search-service/fuzzy-search
export async function getPlaceAutocomplete(
  key: string,
  address: string,
  limit: number,
  offset: number = 0,
): Promise<MapApiResult[]> {
  try {
    const autocomplete = await axios.get(
      `https://api.tomtom.com/search/2/search/${address}.json'`,
      {
        params: {
          key,
          limit: limit,
          ofs: offset,
          countrySet: "AU",
          idxSet: "PAD,Addr,Str",
        },
      },
    );

    return autocomplete.data.results;
  } catch (error) {
    const axiosError = error as AxiosError;
    const ex = `Error: ${axiosError.response?.data.httpStatusCode} response received from Tom Tom - ${axiosError.response?.data.errorText}`;
    console.log(ex);
    throw new Error(ex);
  }
}
