# Address Lookup

This library allows lookup of Australian addresses based on a partial address search

## Configuration
This library uses the [Tom Tom API](https://developer.tomtom.com/search-api/documentation/search-service/search-service) and requires an API key.  This should be configured in an env var TOMTOM_API_KEY.

## Functions
The library contains a single function getAutoCompleteDetails which accepts a partial address string, an optional result limit (default 100) and an optional result offset (default 0), and returns a list of address details.

## Example
```
import { getAutoCompleteDetails } from "@montu/maps-backend-challenge"

const res = await getAutoCompleteDetails("Charlotte Street", 10, 0);
```