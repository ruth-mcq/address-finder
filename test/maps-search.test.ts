import { config } from "dotenv";
import { describe } from "@jest/globals";
import { getPlaceAutocomplete } from "../src/maps-api";
import { getAutoCompleteDetails } from "../src";

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
      const res = await getAutoCompleteDetails("Charlotte Street");
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

    it("fails for no api key", async () => {
      const env = process.env;
      process.env = {};
      await expect(
        getAutoCompleteDetails("Charlotte Street"),
      ).rejects.toThrow();
      process.env = env;
    });
  });

  describe("getPlaceAutocomplete", () => {
    it("handles no results", async () => {
      const res = await getPlaceAutocomplete(
        process.env.TOMTOM_API_KEY ?? "",
        "asfasffasfasafsafs",
        100,
      );
      expect(res).toStrictEqual([]);
    });

    it("handles error", async () => {
      await expect(
        getPlaceAutocomplete(process.env.TOMTOM_API_KEY ?? "", "", 10),
      ).rejects.toThrow();
    });
  });
});
