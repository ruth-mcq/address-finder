import axios from "axios";
import {
  Address,
  MapApiResult,
  UnauthorisedError,
  UnknownError,
  ValidationError,
} from "./model";
import { IMapApi } from "./imaps-api";

import axiosRetry from "axios-retry";

export class TomTomApiClient implements IMapApi {
  readonly apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;

    axiosRetry(axios, {
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: axiosRetry.isRetryableError,
      retries: 3,
    });
    axios.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      function (error) {
        //already handled unauthroised so just return
        if (error instanceof UnauthorisedError) {
          return Promise.reject(error);
        }
        //unauthorised access
        if (
          (error.response != undefined &&
            (error.response.status === 403 || error.response.status === 401)) ||
          (error.status != undefined &&
            (error.status === 403 || error.status === 401))
        ) {
          return Promise.reject(
            new UnauthorisedError(
              "Unauthorised access to address data. Check your API Key.",
            ),
          );
        } else {
          //all other errors
          return Promise.reject(
            new UnknownError("Expected error retrieving address data"),
          );
        }
      },
    );
  }

  async getPlaceAutocomplete(
    address: string,
    limit: number,
    offset: number = 0,
  ): Promise<Address[]> {
    //validate inputs:
    if (limit < 1 || limit > 100) {
      throw new ValidationError("limit must be between 1 and 100");
    }
    if (offset < 0) {
      throw new ValidationError("offset cannot be less than 0");
    }
    const autocomplete = await axios
      .get(`https://api.tomtom.com/search/2/search/${address}.json'`, {
        params: {
          key: this.apiKey,
          limit: limit,
          ofs: offset,
          countrySet: "AU",
          idxSet: "PAD,Addr,Str",
        },
      })
      .then(async (apiResponse) => {
        return apiResponse.data.results.map((result: MapApiResult) => {
          const address: Address = {
            placeId: result.id,
            ...result.address,
          };
          return address;
        });
      });

    return autocomplete;
  }
}
