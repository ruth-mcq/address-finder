export type Address = {
  placeId: string;
  streetNumber?: string | undefined;
  streetName: string | undefined;
  municipality?: string | undefined;
  postalCode?: string | undefined;
  countryCode: string | undefined;
  country: string | undefined;
  freeformAddress: string | undefined;
};

export interface MapApiResult {
  type: string;
  id: string;
  score: number;
  address: TomTomAddress;
  position: Position;
  viewport: Viewport;
}

export interface TomTomAddress {
  streetNumber: string;
  streetName: string;
  municipality?: string;
  countrySecondarySubdivision: string;
  countrySubdivision: string;
  countrySubdivisionName: string;
  countrySubdivisionCode: string;
  countryCode: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  localName?: string;
  municipalitySubdivision?: string;
  postalCode?: string;
  neighbourhood?: string;
}

export interface Position {
  lat: number;
  lon: number;
}

export interface Viewport {
  topLeftPoint: TopLeftPoint;
  btmRightPoint: BtmRightPoint;
}

export interface TopLeftPoint {
  lat: number;
  lon: number;
}

export interface BtmRightPoint {
  lat: number;
  lon: number;
}
