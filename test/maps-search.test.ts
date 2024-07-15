import { config } from "dotenv";
import { describe } from "@jest/globals";
import { TomTomApiClient } from "../src/maps-api";
import { getAutoCompleteDetails } from "../src";
import { UnauthorisedError, ValidationError } from "../src/model";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

config();

// These are end-to-end tests and need an api key
describe("Tomtom Places E2E Tests", () => {
  describe("getAutoCompleteDetails", () => {
    it("returns a promise", () => {
      const res = getAutoCompleteDetails("Charlotte Street");
      expect(res).toBeInstanceOf(Promise);
    });

    it("can fetch street from the autocomplete api", async () => {
      const res = await getAutoCompleteDetails("Charlotte Street");
      const firstRes = res[0];
      expect(firstRes).toHaveProperty("placeId");
      expect(firstRes).toHaveProperty("streetName");
      expect(firstRes).toHaveProperty("countryCode");
      expect(firstRes).toHaveProperty("country");
      expect(firstRes).toHaveProperty("freeformAddress");
      expect(firstRes).toHaveProperty("municipality");
    });

    it("can fetch address from the autocomplete api", async () => {
      const res = await getAutoCompleteDetails("10 Elizabeth Street");
      const firstRes = res[0];
      expect(firstRes).toHaveProperty("placeId");
      expect(firstRes).toHaveProperty("streetNumber");
      expect(firstRes).toHaveProperty("postalCode");
      expect(firstRes).toHaveProperty("streetName");
      expect(firstRes).toHaveProperty("countryCode");
      expect(firstRes).toHaveProperty("country");
      expect(firstRes).toHaveProperty("freeformAddress");
      expect(firstRes).toHaveProperty("municipality");
    });

    it("only results from Australia returned", async () => {
      const res = await getAutoCompleteDetails("Charlotte Street", 100);
      res.forEach((result) => {
        expect(result).toHaveProperty("country");
        expect(result["countryCode"]).toBe("AU");
        expect(result["country"]).toBe("Australia");
      });
    });

    it("limits and offsets results", async () => {
      const firstTwentyResults = await getAutoCompleteDetails(
        "Charlotte Street",
        20,
      );
      expect(firstTwentyResults.length).toBe(20);

      const firstTenResults = await getAutoCompleteDetails(
        "Charlotte Street",
        10,
      );
      expect(firstTenResults.length).toBe(10);

      const nextTenResults = await getAutoCompleteDetails(
        "Charlotte Street",
        10,
        10,
      );
      expect(nextTenResults.length).toBe(10);

      firstTenResults.forEach((result) => {
        //all twenty results should contain these ten
        expect(firstTwentyResults).toContainEqual(result);
        //the next ten results shouldn't contain these ten
        expect(nextTenResults).not.toContainEqual(result);
      });
      nextTenResults.forEach((result) => {
        //all twenty results should contain these ten
        expect(firstTwentyResults).toContainEqual(result);
        //the first ten results shouldn't contain these ten
        expect(firstTenResults).not.toContainEqual(result);
      });
    });
  });

  describe("getPlaceAutocomplete", () => {
    const client = new TomTomApiClient(process.env.TOMTOM_API_KEY ?? "");
    it("handles no results", async () => {
      const res = await client.getPlaceAutocomplete("asfasffasfasafsafs", 100);
      expect(res).toStrictEqual([]);
    });

    it("fails with limit > 100", async () => {
      const rejected = client.getPlaceAutocomplete("asfasffasfasafsafs", 101);
      await expect(rejected).rejects.toThrow(ValidationError);
      await expect(rejected).rejects.toThrow("limit must be between 1 and 100");
    });

    it("fails with limit < 1", async () => {
      const error = client.getPlaceAutocomplete("asfasffasfasafsafs", 0);
      await expect(error).rejects.toThrow(ValidationError);
      await expect(error).rejects.toThrow("limit must be between 1 and 100");
    });

    it("fails with offset < 0", async () => {
      const error = client.getPlaceAutocomplete("asfasffasfasafsafs", 100, -1);
      await expect(error).rejects.toThrow(ValidationError);
      await expect(error).rejects.toThrow("offset cannot be less than 0");
    });

    it("handles error", async () => {
      const invalidClient = new TomTomApiClient("");
      const error = invalidClient.getPlaceAutocomplete("", 10);
      await expect(error).rejects.toThrow(UnauthorisedError);
    });

    it("Should retry", async () => {
      const validResponse = {
        results: [],
      };
      const mock = new MockAdapter(axios);
      mock.onGet().replyOnce(500, {});
      mock.onGet().replyOnce(200, validResponse);
      const res = await client.getPlaceAutocomplete("Charlotte Street", 100);
      expect(res).toStrictEqual([]);
    });
  });
  describe("ValidationError", () => {
    it("generated correctly", async () => {
      const expectedErrorMsg = "This is the error";
      try {
        throw new ValidationError(expectedErrorMsg);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.message).toBe(expectedErrorMsg);
        expect(error.stack).toBeUndefined();
      }
    });
  });
});
